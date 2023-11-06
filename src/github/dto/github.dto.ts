import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GitHubDTO {
  @IsNotEmpty()
  @IsInt()
  id: number; // githubRepoId

  @IsNotEmpty()
  @IsString()
  name: string; // githubRepoId

  @IsNotEmpty()
  @IsString()
  created_at: string; // githubCreatedAt

  @IsNotEmpty()
  @IsString()
  pushed_at: string; // githubUpdatedAt

  @IsNotEmpty()
  @IsString()
  html_url: string; // linkRepo

  @IsNotEmpty()
  @IsString()
  homepage: string; // liveSite

  @IsNotEmpty()
  @IsString()
  description: string; // description
}

export class SearchGitHubDTO {
  @IsNotEmpty()
  @IsInt()
  id: number; // githubRepoId

  @IsNotEmpty()
  @IsString()
  name: string; // githubRepoId
}
