import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { GitHubDTO, SearchGitHubDTO } from './dto/github.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly gitHubService: GithubService) {}

  @Get('repo/:repoName')
  async getRepo(
    @Param('repoName') repoName: string,
  ): Promise<GitHubDTO | null> {
    return this.gitHubService.getRepo(repoName);
  }

  @Get('repos')
  async getRepos(): Promise<SearchGitHubDTO[] | null> {
    return this.gitHubService.getRepos();
  }
}
