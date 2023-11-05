import { IsString, IsDate, IsOptional, IsArray } from 'class-validator';

export class ProjectDTO {
  @IsString()
  name: string;

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

  @IsString()
  linkRepo: string;

  @IsString()
  liveSite: string;
}
