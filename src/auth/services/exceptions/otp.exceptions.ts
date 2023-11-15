import { HttpStatus } from '@nestjs/common';
import {
  StandardException,
  StandardExceptionReason,
} from 'src/common/exceptions/standard-exception';

export const TokenInvalid = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_INVALID,
    message: 'Invalid token, check the code in your authentication app',
  },
  HttpStatus.UNAUTHORIZED,
);

export const GitHubTokenInvalid = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_INVALID,
    message: 'github token is invalid.',
  },
  HttpStatus.UNAUTHORIZED,
);
