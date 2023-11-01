import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RecoveryDTO } from 'src/auth/dto/recovery.tdo';
import { UserDTO } from 'src/auth/dto/user.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDTO, token: string) {
    const url = `http://localhost:3000/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.email,
        url,
      },
    });
  }

  async sendRecoveryCode(recovery: RecoveryDTO) {
    const { code, expiration } = recovery;
    await this.mailerService.sendMail({
      to: recovery.userEmail,
      subject: 'Codigo de confor de recuperação de conta',
      template: './recoverycode',
      context: {
        code,
        expiration,
      },
    });
  }
}
