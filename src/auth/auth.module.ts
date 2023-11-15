import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { MailModule } from '@mail/mail.module';
import { JwtGuard } from './guards/jwt.gurds';
import { OTPService } from './services/otp.service';
/* import { OTPModule } from './services/otp.module'; */

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.secret'),
      }),
    }),
    PrismaModule,
    MailModule,
  ],
  providers: [AuthService, JwtGuard, OTPService],
  controllers: [AuthController],
  exports: [AuthService, OTPService],
})
export class AuthModule {}
