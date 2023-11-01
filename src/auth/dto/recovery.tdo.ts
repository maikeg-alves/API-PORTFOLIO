import { IsDate, IsEmail, IsInt, IsString } from 'class-validator';

export class RecoveryDTO {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsEmail()
  userEmail: string;

  @IsString()
  code: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  expiration: Date;
}
