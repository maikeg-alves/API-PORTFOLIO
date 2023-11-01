import { IsNotEmpty, IsString } from 'class-validator';

export class signUpDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
