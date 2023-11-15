import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService, UserNoPassword } from './auth.service';
import { signUpDTO } from './dto/signup.dto';
import { UserDTO } from './dto/user.dto';
import { loginDTO } from './dto/login.dto';
import { resetPasswordDTO } from './dto/resetPassword.dto';
import { JwtGuard } from './guards/jwt.gurds';
import { OTPService } from './services/otp.service';
import { DTOverify } from './services/dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OTPService,
  ) {}

  @Post('login')
  async loginUser(@Body() loginData: loginDTO): Promise<UserDTO> {
    return await this.authService.login(loginData);
  }

  @Post('signup')
  async signUpUser(@Body() registrationData: signUpDTO): Promise<UserDTO> {
    return await this.authService.signUp(registrationData);
  }

  @Get('confirm/email')
  async verifyUserEmailByToken(@Query('token') token: string) {
    return this.authService.verifyUserEmailByToken(token);
  }

  @Post('recovery')
  async recoveryPassword(@Body() user: UserNoPassword): Promise<void> {
    await this.authService.recoveryUserPassword(user);
  }

  @Get('recovery/confirm/:code')
  async confirmCode(
    @Param('code') code: string,
  ): Promise<{ recoveryToken: string }> {
    return await this.authService.verifyCodeRecovery(code);
  }

  @Post('recovery/reset-password')
  @UseGuards(JwtGuard)
  async resetPassword(
    @Body() resetPasswordData: resetPasswordDTO,
    @Req() request,
  ) {
    return await this.authService.resetUserPassword(resetPasswordData, request);
  }

  @Post('otp/generate')
  async GenerateOTP(@Body('user_id') user_id: string) {
    return await this.otpService.GenerateOTP(user_id);
  }
  @Post('otp/verify')
  async VerifyOTP(@Body() otpData: DTOverify) {
    return await this.otpService.VerifyOTP(otpData.user_id, otpData.token);
  }

  @Post('otp/validate')
  async ValidateOTP(@Body() otpData: DTOverify): Promise<{ token: string }> {
    return await this.otpService.ValidateOTP(otpData.user_id, otpData.token);
  }

  @Post('otp/disable')
  async DisableOTP(user_id: string) {
    return await this.otpService.DisableOTP(user_id);
  }
}
