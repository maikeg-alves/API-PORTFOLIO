import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class TechDTO {
  @IsInt()
  @IsOptional()
  id: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsString()
  description: string;
}
