import { IsString, IsDate, IsOptional, IsArray } from 'class-validator';

export class ProjectDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  thumbnail_url: string;

  @IsString()
  githubRepoId: string;

  @IsOptional()
  @IsDate()
  githubCreatedAt: Date;

  @IsOptional()
  @IsDate()
  githubUpdatedAt: Date;

  @IsOptional()
  @IsString()
  linkRepo: string;

  @IsOptional()
  @IsString()
  liveSite: string;
}
