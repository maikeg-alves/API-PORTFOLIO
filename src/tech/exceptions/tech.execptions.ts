import {
  StandardException,
  StandardExceptionReason,
} from '../../common/exceptions/standard-exception';
import { HttpStatus } from '@nestjs/common';

export const TechNotFoundException = StandardException(
  {
    reason: StandardExceptionReason.TECH_NOT_FOUND,
    message: 'Tecnologia não encontrada.',
  },
  HttpStatus.NOT_FOUND,
);

export const TechCreationFailedException = StandardException(
  {
    reason: StandardExceptionReason.TECH_CREATION_FAILED,
    message: 'Falha ao criar a tecnologia.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export const TechUpdateFailedException = StandardException(
  {
    reason: StandardExceptionReason.TECH_UPDATE_FAILED,
    message: 'Falha ao atualizar a tecnologia.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export const TechDeletionFailedException = StandardException(
  {
    reason: StandardExceptionReason.TECH_DELETION_FAILED,
    message: 'Falha ao excluir a tecnologia.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);
