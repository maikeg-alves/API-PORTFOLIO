/* import { databaseConfig } from './database.config';
import { appConfig } from './app.config'; */
import { authConfig } from './auth/auth.config';
import { mailConfig } from './mail/mail.config';
/* import { redisConfig } from './redis.config';
 */

const NAMESPACES = [
  /* appConfig,
  databaseConfig,
  redisConfig, */
  authConfig,
];

const CONFIG = { mailConfig: mailConfig };

export {
  NAMESPACES,
  CONFIG,
  /* appConfig,
  databaseConfig,
  redisConfig, */
  authConfig,
};
