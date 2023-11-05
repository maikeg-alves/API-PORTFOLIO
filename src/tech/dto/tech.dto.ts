import { IsString } from 'class-validator';

export class TechDTO {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsString()
  description: string;
}
