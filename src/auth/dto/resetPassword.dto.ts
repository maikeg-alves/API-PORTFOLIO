import { IsString } from 'class-validator';

export class resetPasswordDTO {
  @IsString()
  newPassword: string;

  @IsString()
  newPasswordConfirm: string;
}
