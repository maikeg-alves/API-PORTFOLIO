import {
  StandardException,
  StandardExceptionReason,
} from '../../common/exceptions/standard-exception';
import { HttpStatus } from '@nestjs/common';

export const ProjectNotFoundException = StandardException(
  {
    reason: StandardExceptionReason.PROJECT_NOT_FOUND,
    message: 'Projeto não encontrado.',
  },
  HttpStatus.NOT_FOUND,
);

export const ProjectCreationFailedException = StandardException(
  {
    reason: StandardExceptionReason.PROJECT_CREATION_FAILED,
    message: 'Falha ao criar o projeto.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export const ProjectUpdateFailedException = StandardException(
  {
    reason: StandardExceptionReason.PROJECT_UPDATE_FAILED,
    message: 'Falha ao atualizar o projeto.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);

export const ProjectDeletionFailedException = StandardException(
  {
    reason: StandardExceptionReason.PROJECT_DELETION_FAILED,
    message: 'Falha ao excluir o projeto.',
  },
  HttpStatus.INTERNAL_SERVER_ERROR,
);
