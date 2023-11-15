import { Injectable } from '@nestjs/common';
import { encode } from 'hi-base32';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PrismaError } from 'src/config/prisma/error/prisma.erros';
import * as crypto from 'crypto';
import * as OTPAuth from 'otpauth';
import * as AuthExceptions from '../exceptions/auth.execptions';
import * as OtpExceptions from './exceptions/otp.exceptions';
import { AuthService } from '../auth.service';

@Injectable()
export class OTPService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private generateRandomBase32() {
    const buffer = crypto.randomBytes(15);
    const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
    return base32;
  }

  async GenerateOTP(
    user_id: string,
  ): Promise<{ otp_auth_url: string; otp_base32: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }

      const base32_secret = this.generateRandomBase32();

      const totp = new OTPAuth.TOTP({
        issuer: 'Maicon Gabriel Alves',
        label: 'Painel Dashboard',
        algorithm: 'SHA1',
        digits: 6,
        secret: base32_secret,
      });

      const otpauth_url = totp.toString();

      await this.prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data: {
          otp_auth_url: otpauth_url,
          otp_base32: base32_secret,
        },
      });

      return {
        otp_auth_url: otpauth_url,
        otp_base32: base32_secret,
      };
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.UserAlreadyExists();
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        default:
          throw error;
      }
    }
  }

  async VerifyOTP(user_id: string, token: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }

      const totop = new OTPAuth.TOTP({
        issuer: 'Maicon Gabriel Alves',
        label: 'Painel Dashboard',
        algorithm: 'SHA1',
        digits: 6,
        secret: user.otp_base32,
      });

      const delta = totop.validate({ token });

      if (!delta) {
        throw new OtpExceptions.TokenInvalid();
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data: {
          ...user,
          otp_enabled: true,
          otp_verified: true,
        },
      });

      return {
        otp_verified: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.firstName,
          email: updatedUser.email,
          otp_enabled: updatedUser.otp_enabled,
        },
      };
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.UserAlreadyExists();
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        default:
          throw error;
      }
    }
  }

  async ValidateOTP(
    user_id: string,
    token: string,
  ): Promise<{ token: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }

      const totop = new OTPAuth.TOTP({
        issuer: 'Maicon Gabriel Alves',
        label: 'Painel Dashboard',
        algorithm: 'SHA1',
        digits: 6,
        secret: user.otp_base32,
      });

      const delta = totop.validate({ token, window: 1 });

      if (!delta) {
        throw new OtpExceptions.TokenInvalid();
      }

      const tokenAcesse = await this.authService.grantAccessToken(user);

      return {
        token: tokenAcesse,
      };
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.UserAlreadyExists();
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        default:
          throw error;
      }
    }
  }

  async DisableOTP(user_id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new AuthExceptions.UserNotFound();
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp_enabled: false,
        },
      });

      if (!updatedUser) {
        throw new AuthExceptions.UserUnverified();
      }

      return {
        otp_disabled: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          otp_enabled: updatedUser.otp_enabled,
        },
      };
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation:
          throw new AuthExceptions.UserAlreadyExists();
        case PrismaError.RelatedRecordNotFound:
          throw new AuthExceptions.UserNotFound();
        default:
          throw error;
      }
    }
  }
}
