import { HttpException, HttpStatus } from '@nestjs/common';

export enum StandardExceptionReason {
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  USER_NOT_FOUND = 'UserNotFound',
  USER_UNVERIFIED = 'UserUnverified',
  USER_DISABLED = 'UserDisabled',
  INVALID_CREDENTIALS = 'InvalidCredentials',
  TOKEN_EXPIRED = 'TokenExpired',
  TOKEN_INVALID = 'TokenInvalid',
  TOKEN_USED = 'TokenUsed',
  RECAPTCHA_FAILED = 'RecaptchaFailed',
  FINGERPRINT_MISMATCH = 'FingerprintMismatch',
  UNKNOWNERROR = 'UnknownError',
  TECH_NOT_FOUND = 'TechNotFound',
  TECH_CREATION_FAILED = 'TechCreationFailed',
  TECH_UPDATE_FAILED = 'TechUpdateFailed',
  TECH_DELETION_FAILED = 'TechDeletionFailed',
  PROJECT_NOT_FOUND = 'ProjectNotFound',
  PROJECT_CREATION_FAILED = 'ProjectCreationFailed',
  PROJECT_UPDATE_FAILED = 'ProjectUpdateFailed',
  PROJECT_DELETION_FAILED = 'ProjectDeletionFailed',
  REPOSITORY_NOT_FOUND = 'RepositoryNotFoud',
}

export interface StandardExceptionBody {
  reason: StandardExceptionReason | string;
  message: string;
}

export function StandardException(
  body: StandardExceptionBody,
  status: HttpStatus,
): new () => HttpException {
  return class extends HttpException {
    constructor() {
      super(body, status);
    }
  };
}
