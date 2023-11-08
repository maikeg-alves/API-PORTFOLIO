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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginData: loginDTO): Promise<string> {
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
  async confirmCode(@Param('code') code: string): Promise<string> {
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
}
