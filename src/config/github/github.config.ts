import { registerAs } from '@nestjs/config';

export const gitHubConfig = registerAs('github', () => ({
  user: process.env.GITHUB_USER,
  apitoken: process.env.GITHUB_API_TOKEN,
}));
