import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDTO {
  @IsInt()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsEmail()
  email: string;

  @IsString()
  hash: string;

  @IsBoolean()
  @IsOptional()
  activated?: boolean;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  otp_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  otp_verified?: boolean;

  @IsString()
  @IsOptional()
  otp_ascii?: string;

  @IsString()
  @IsOptional()
  otp_hex?: string;

  @IsString()
  @IsOptional()
  otp_base32?: string;

  @IsString()
  @IsOptional()
  otp_auth_url?: string;
}
