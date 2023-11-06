/* import { databaseConfig } from './database.config';
import { appConfig } from './app.config'; */
import { authConfig } from './auth/auth.config';
import { mailConfig } from './mail/mail.config';
import { gitHubConfig } from './github/github.config';

const NAMESPACES = [
  /* appConfig,
  databaseConfig,
  redisConfig, */
  gitHubConfig,
  authConfig,
];

const CONFIG = { mailConfig: mailConfig, gitHubConfig: gitHubConfig };

export {
  NAMESPACES,
  CONFIG,
  /* appConfig,
  databaseConfig,
  redisConfig, */
  gitHubConfig,
  authConfig,
};
