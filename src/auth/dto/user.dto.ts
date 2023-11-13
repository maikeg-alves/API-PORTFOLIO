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
}
