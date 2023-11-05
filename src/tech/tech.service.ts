import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TechDTO } from './dto/tech.dto';
import * as TechExceptions from './exceptions/tech.execptions';
import { PrismaError } from 'src/prisma/error/prisma.erros';

@Injectable()
export class TechService {
  constructor(private readonly prisma: PrismaService) {}

  async getTechs(): Promise<TechDTO[] | null> {
    try {
      const getTechs = await this.findTech();

      if (
        !getTechs ||
        (Array.isArray(getTechs) && getTechs.length === 0) ||
        !Array.isArray(getTechs)
      ) {
        throw new TechExceptions.TechNotFoundException();
      }

      return getTechs;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `User with the provided ${this.prisma.offendingFields(
                (error.meta as any).target,
              )} already exists.`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }

  async getOneTech(id: string): Promise<TechDTO | null> {
    try {
      const getTech = await this.findTech(id);

      if (!getTech || Array.isArray(getTech))
        throw new TechExceptions.TechNotFoundException();

      return getTech;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Tech with the provided ${this.prisma.offendingFields(
                (error.meta as any).target ?? [],
              )} already exists.`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }

  async createTech(techData: TechDTO): Promise<TechDTO> {
    try {
      const techCreate = await this.prisma.tech.create({
        data: {
          ...techData,
        },
      });

      if (!techCreate) throw new TechExceptions.TechCreationFailedException();

      return techCreate;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Tech with the provided already exists. ${this.prisma.offendingFields(
                (error.meta as any).target ?? [],
              )}`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }

  async updateTech(techData: TechDTO, id: string): Promise<TechDTO | null> {
    try {
      const getTech = await this.findTech(id);

      if (!getTech) throw new TechExceptions.TechNotFoundException();

      const updateTech = await this.prisma.tech.update({
        where: { id: +id },
        data: {
          ...techData,
        },
      });

      if (!updateTech) throw new TechExceptions.TechUpdateFailedException();

      return updateTech;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Tech with the provided already exists. ${this.prisma.offendingFields(
                (error.meta as any).target ?? [],
              )}`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }

  async deleteTech(id: string): Promise<TechDTO | null> {
    try {
      const getTech = await this.findTech(id);

      if (!getTech) throw new TechExceptions.TechNotFoundException();

      const deleteTech = await this.prisma.tech.findUniqueOrThrow({
        where: { id: +id },
      });

      if (!deleteTech) throw new TechExceptions.TechDeletionFailedException();

      return deleteTech;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Tech with the provided already exists. ${this.prisma.offendingFields(
                (error.meta as any).target ?? [],
              )}`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }

  async findTech(techId?: string): Promise<TechDTO | TechDTO[] | null> {
    try {
      if (!techId) {
        return (await this.prisma.tech.findMany()) as TechDTO[] | null;
      }
      return (await this.prisma.tech.findUnique({
        where: { id: +techId },
      })) as TechDTO | null;
    } catch (error) {
      console.error(error.code);
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Tech with the provided ${this.prisma.offendingFields(
                (error.meta as any).target,
              )} already exists.`,
            },
            HttpStatus.CONFLICT,
          );
        }
        case PrismaError.TableDoesNotExist: {
          throw new HttpException(
            {
              reason: 'TableDoesNotExist',
              message: `No data was found in the Techs table or the table does not exist`,
            },
            HttpStatus.CONFLICT,
          );
        }
        default: {
          throw error;
        }
      }
    }
  }
}
