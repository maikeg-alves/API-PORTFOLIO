import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as GitHubExceptions from './exceptions/github.exceptions';
import { GitHubDTO, SearchGitHubDTO } from './dto/github.dto';

@Injectable()
export class GithubService {
  constructor(private readonly config: ConfigService) {}

  async getRepo(nameRepo: string): Promise<GitHubDTO | null> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.get<string>(
          'github.user',
        )}/${nameRepo}`,
        {
          method: 'GET',
          headers: this.githubHeaders(),
        },
      );

      if (!response.ok) {
        switch (response.status) {
          case 404: {
            throw new GitHubExceptions.RepositoryNotFound();
          }
          case 401: {
            throw new GitHubExceptions.GitHubTokenInvalid();
          }
          default: {
            throw new HttpException(
              {
                reason: response.status,
                message: response.statusText,
              },
              response.status,
            );
          }
        }
      }

      const repo = (await response.json()) as GitHubDTO;

      const repoData = {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        created_at: repo.created_at,
        pushed_at: repo.pushed_at,
      };

      return repoData;
    } catch (error) {
      if (error.name === 'SyntaxError') {
        throw new HttpException(
          {
            reason: 'InvalidResponse',
            message: 'The response from the API is invalid.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw error;
      }
    }
  }

  async getRepos(): Promise<SearchGitHubDTO[] | null> {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.config.get<string>(
          'github.user',
        )}/repos`,
        {
          method: 'GET',
          headers: this.githubHeaders(),
        },
      );
      if (!response.ok) {
        switch (response.status) {
          case 404: {
            throw new GitHubExceptions.RepositoryNotFound();
          }
          case 401: {
            throw new GitHubExceptions.GitHubTokenInvalid();
          }
          default: {
            throw new HttpException(
              {
                reason: response.status,
                message: response.statusText,
              },
              response.status,
            );
          }
        }
      }

      const repos = (await response.json()) as SearchGitHubDTO[];

      const rebilledRepos: SearchGitHubDTO[] = repos.map(({ id, name }) => ({
        id,
        name,
      }));

      return rebilledRepos;
    } catch (error) {
      if (error.name === 'SyntaxError') {
        throw new HttpException(
          {
            reason: 'InvalidResponse',
            message: 'The response from the API is invalid.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw error;
      }
    }
  }

  githubHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.get<string>('github.apitoken')}`,
    };
  }
}
