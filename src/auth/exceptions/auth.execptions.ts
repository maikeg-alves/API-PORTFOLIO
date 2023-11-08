import { HttpStatus } from '@nestjs/common';
import {
  StandardException,
  StandardExceptionReason,
} from 'src/common/exceptions/standard-exception';

export const Unauthorized = StandardException(
  {
    reason: StandardExceptionReason.UNAUTHORIZED,
    message: `Unauthorized`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const UserNotFound = StandardException(
  {
    reason: StandardExceptionReason.USER_NOT_FOUND,
    message: `User with the provided username or email was not found.`,
  },
  HttpStatus.NOT_FOUND,
);

export const UserUnverified = StandardException(
  {
    reason: StandardExceptionReason.USER_UNVERIFIED,
    message: `User has not yet verified their email address.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const UserDisabled = StandardException(
  {
    reason: StandardExceptionReason.USER_DISABLED,
    message: `This user has been marked inactive. This can be corrected by an administrator.`,
  },
  HttpStatus.FORBIDDEN,
);

export const UserAlreadyExists = StandardException(
  {
    reason: StandardExceptionReason.USER_ALREADY_EXISTS,
    message: `The user with the provided email already exists.`,
  },
  HttpStatus.CONFLICT,
);

export const InvalidCredentials = StandardException(
  {
    reason: StandardExceptionReason.INVALID_CREDENTIALS,
    message: `Invalid credentials provided.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const TokenExpired = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_EXPIRED,
    message: `The provided token has expired.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const TokenInvalid = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_INVALID,
    message: `The provided token is invalid.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const TokenUsed = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_USED,
    message: `The provided token has already been used. Please use a new token.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const FingerprintMismatch = StandardException(
  {
    reason: StandardExceptionReason.FINGERPRINT_MISMATCH,
    message: `The provided token fingerprint is invalid.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const RecaptchaFailed = StandardException(
  {
    reason: StandardExceptionReason.RECAPTCHA_FAILED,
    message: `The provided recaptcha response is invalid or none was provided.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const CodeInvalid = StandardException(
  {
    reason: StandardExceptionReason.INVALID_CREDENTIALS,
    message: `The provided code is invalid.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const CodeExpired = StandardException(
  {
    reason: StandardExceptionReason.TOKEN_EXPIRED, // Você pode ajustar a razão conforme necessário
    message: `The provided code has expired.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const CodeIncorrect = StandardException(
  {
    reason: StandardExceptionReason.INVALID_CREDENTIALS, // Você pode ajustar a razão conforme necessário
    message: `The provided code is incorrect.`,
  },
  HttpStatus.UNAUTHORIZED,
);

export const CodeSeend = StandardException(
  {
    reason: StandardExceptionReason.UNKNOWNERROR, // Você pode ajustar a razão conforme necessário
    message: `A recovery has already been requested for this email.`,
  },
  HttpStatus.BAD_REQUEST,
);

export const UnknownError = StandardException(
  {
    reason: StandardExceptionReason.UNKNOWNERROR,
    message: `An unknown error has occurred.`,
  },
  HttpStatus.BAD_REQUEST,
);

export const MissingParameters = StandardException(
  {
    reason: StandardExceptionReason.MISSING_PARAMETERS,
    message: `One or more required parameters are missing or nonexistent.`,
  },
  HttpStatus.BAD_REQUEST, // Use HttpStatus.BAD_REQUEST to indicate a client-side error
);
