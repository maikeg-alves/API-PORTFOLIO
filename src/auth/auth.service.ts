import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { signUpDTO } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AccessPayload, FullAccessPayload, TokenType } from './dto/jwt.dto';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import * as AuthExceptions from './exceptions/auth.execptions';
import { PrismaError } from 'src/prisma/error/prisma.erros';
import { loginDTO } from './dto/login.dto';
import { resetPasswordDTO } from './dto/resetPassword.dto';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';

export type UserNoPassword = Omit<loginDTO, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailSerivce: MailService,
  ) {}

  async login(loginData: loginDTO): Promise<{ token: string }> {
    try {
      const { email, password } = loginData;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }

      const passwordMatch = await bcrypt.compare(password, user.hash);

      if (!passwordMatch) {
        throw new AuthExceptions.InvalidCredentials();
      }

      const token = await this.grantAccessToken(user);

      return { token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `User with the provided ${this.prisma.offendingFields(
                (error.meta as any).target,
              )} already exists.`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw error;
    }
  }

  async signUp(registrationData: signUpDTO): Promise<UserDTO> {
    const hashedPassword = await bcrypt.hash(
      registrationData.password,
      this.config.get<number>('auth.saltRounds'),
    );

    try {
      delete registrationData.password;

      const createUser = await this.prisma.user
        .create({
          data: {
            ...registrationData,
            hash: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        .catch((e) => {
          throw e;
        });

      const token = await this.grantAccessToken(createUser);

      await this.mailSerivce.sendUserConfirmation(createUser, token);

      return createUser;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.UserAlreadyExists();
        default:
          throw new AuthExceptions.UnknownError();
      }
    }
  }

  async recoveryUserPassword(user: UserNoPassword): Promise<void> {
    if (!user.email) {
      throw new AuthExceptions.MissingParameters();
    }

    const userData = await this.verifyUserEmail(user.email);

    if (!userData) {
      throw new AuthExceptions.UserNotFound();
    }

    const code = this.generateRandomCode(6);
    const expirationMilliseconds = new Date().getTime() + 60 * 60 * 1000;
    const expirationDate = new Date(expirationMilliseconds);

    try {
      const recoveryCode = await this.prisma.passwordReset.create({
        data: {
          userId: userData.id,
          userEmail: userData.email,
          code: code,
          expiration: expirationDate,
        },
      });

      await this.mailSerivce.sendRecoveryCode(recoveryCode);
    } catch (error) {
      switch (error.code) {
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.CodeSeend();
        default:
          console.error(error);
          throw new AuthExceptions.UnknownError();
      }
    }
  }

  async verifyCodeRecovery(code: string): Promise<{ recoveryToken: string }> {
    try {
      if (!code || !/^[0-9]{6}$/.test(code)) {
        throw new AuthExceptions.CodeIncorrect();
      }

      const verifyCode = await this.prisma.passwordReset.findUnique({
        where: {
          code,
        },
      });

      if (!verifyCode) {
        throw new AuthExceptions.CodeInvalid();
      }

      if (new Date() > verifyCode.expiration) {
        await this.prisma.passwordReset.deleteMany({
          where: { userEmail: verifyCode.userEmail, code },
        });
        throw new AuthExceptions.CodeExpired();
      }

      const { userId, userEmail } = verifyCode;

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
          email: userEmail,
        },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }

      const recoveryToken = await this.grantAccessToken(user);

      return { recoveryToken: recoveryToken };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PrismaError.UniqueConstraintViolation) {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `User with the provided ${this.prisma.offendingFields(
                (error.meta as any).target,
              )} already exists.`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      throw error;
    }
  }

  async resetUserPassword(resetPasswordData: resetPasswordDTO, @Req() request) {
    try {
      const token = request.headers.authorization.replace('Bearer ', '');

      const verifiedToken: AccessPayload = await this.jwtService
        .verifyAsync(token)
        .catch((e) => {
          if (e instanceof TokenExpiredError) {
            throw new AuthExceptions.TokenExpired();
          } else if (e instanceof JsonWebTokenError) {
            throw new AuthExceptions.TokenInvalid();
          }
          throw e;
        });

      const { email, id } = await this.prisma.user.findUnique({
        where: {
          email: verifiedToken.username,
        },
      });

      const hashedPassword = await bcrypt.hash(
        resetPasswordData.newPassword,
        this.config.get<number>('auth.saltRounds'),
      );

      const updateUserPass = await this.prisma.user.update({
        where: {
          id: id,
          email: email,
        },
        data: {
          hash: hashedPassword,
        },
      });

      delete updateUserPass.hash;

      if (updateUserPass) {
        return updateUserPass;
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AuthExceptions.TokenExpired();
      } else if (error instanceof JsonWebTokenError) {
        throw new AuthExceptions.TokenInvalid();
      } else if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaError.RelatedRecordNotFound:
            throw new AuthExceptions.UserNotFound();
          default:
            throw new AuthExceptions.UnknownError();
        }
      }
      throw error;
    }
  }

  async verifyUserEmailByToken(token: string) {
    if (!token) {
      throw new AuthExceptions.MissingParameters();
    }

    try {
      const { subject, email } = await this.jwtService.verifyAsync(token);

      return this.verifyUserEmail(email, subject);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthExceptions.TokenExpired();
      } else if (error.name === 'JsonWebTokenError') {
        throw new AuthExceptions.TokenInvalid();
      }
      throw error;
    }
  }

  async verifyUserEmail(email: string, id?: string): Promise<UserDTO | null> {
    try {
      if (!email && !id) {
        throw new AuthExceptions.MissingParameters();
      }

      if (email) {
        return await this.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
      }

      return await this.prisma.user.update({
        data: {
          activated: true,
        },
        where: {
          id: +id,
          email: email,
        },
      });
    } catch (error) {
      switch (error.code) {
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        default:
          throw new AuthExceptions.UnknownError();
      }
    }
  }

  async grantAccessToken(user: UserDTO, restricted?: boolean): Promise<string> {
    return await this.jwtService.signAsync(
      <AccessPayload>{
        t: TokenType.ACCESS,
        username: user.email,
        restricted,
      },
      {
        subject: user.email,
        expiresIn: `${this.config.get<string>('auth.jwt.time.access')}s`,
      },
    );
  }

  async useAccessToken(token: string): Promise<FullAccessPayload> {
    const payload: FullAccessPayload = await this.jwtService
      .verifyAsync<FullAccessPayload>(token)
      .catch((e) => {
        if (e instanceof TokenExpiredError) {
          throw new AuthExceptions.TokenExpired();
        } else if (e instanceof JsonWebTokenError) {
          throw new AuthExceptions.TokenInvalid();
        }
        throw e;
      });

    if (payload.t !== TokenType.ACCESS) {
      throw new AuthExceptions.TokenInvalid();
    }

    return payload;
  }

  generateRandomCode(length: number) {
    const chars = '0123456789'; // Caracteres permitidos no código
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    return code;
  }
}
