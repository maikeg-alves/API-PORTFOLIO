import { HttpStatus } from '@nestjs/common';
import {
  StandardException,
  StandardExceptionReason,
} from 'src/common/exceptions/standard-exception';

export const RepositoryNotFound = StandardException(
  {
    reason: StandardExceptionReason.REPOSITORY_NOT_FOUND,
    message: 'Repository not found.',
  },
  HttpStatus.NOT_FOUND,
);

export const GitHubTokenInvalid = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_INVALID,
    message: 'github token is invalid.',
  },
  HttpStatus.UNAUTHORIZED,
);
