import { IsString } from 'class-validator';

export class DTOverify {
  @IsString()
  user_id: string;

  @IsString()
  token: string;
}
