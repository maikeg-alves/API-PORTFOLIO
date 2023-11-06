import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ProjectExceptions from './exceptions/project.excpetion';
import { ProjectDTO } from './dto/project.dto';
import { PrismaError } from 'src/prisma/error/prisma.erros';
import { TechService } from 'src/tech/tech.service';
import { ProjectAndTechsDTO } from './dto/projectsAndTechs.dto';
import { TechDTO } from 'src/tech/dto/tech.dto';
import { ProjectTechDTO } from './dto/projectTech.dto';
import { GithubService } from 'src/github/github.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly techService: TechService,
    private readonly githubService: GithubService,
  ) {}

  async getProjects(viewTechs: boolean): Promise<ProjectDTO[] | null> {
    try {
      const projects = await this.findProject(viewTechs);

      if (
        !projects ||
        (Array.isArray(projects) && projects.length === 0) ||
        !Array.isArray(projects)
      ) {
        throw new ProjectExceptions.ProjectNotFoundException();
      }

      return projects;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided ${this.prisma.offendingFields(
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

  async getOneProject(
    id: string,
    viewTechs: boolean,
  ): Promise<ProjectDTO | null> {
    try {
      const getProject = await this.findProject(viewTechs, id);

      if (!getProject || Array.isArray(getProject)) {
        throw new ProjectExceptions.ProjectNotFoundException();
      }

      return getProject;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided ${this.prisma.offendingFields(
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

  async createProject(projectData: ProjectAndTechsDTO): Promise<ProjectDTO> {
    try {
      const githubRepo = await this.githubService.getRepo(
        projectData.githubRepoId,
      );

      const techsChecked = await this.checkingTechIds(projectData.techs);

      const description = projectData.description
        ? projectData.description
        : githubRepo.description;

      console.log(githubRepo.description.length);
      const projectCreate = await this.prisma.project.create({
        data: {
          ...projectData,
          description: description ?? null,
          linkRepo: githubRepo.html_url,
          liveSite: githubRepo.homepage,
          githubCreatedAt: new Date(githubRepo.created_at),
          githubUpdatedAt: new Date(githubRepo.pushed_at),
          techs: {
            connect: techsChecked,
          },
        },
      });

      if (!projectCreate)
        throw new ProjectExceptions.ProjectCreationFailedException();

      return projectCreate;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided already exists. ${this.prisma.offendingFields(
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

  async updateProject(
    projectData: ProjectAndTechsDTO,
    id: string,
  ): Promise<ProjectDTO | null> {
    try {
      const githubRepo = await this.githubService.getRepo(
        projectData.githubRepoId,
      );

      const techsChecked = await this.checkingTechIds(projectData.techs);

      const getProject = (await this.findProject(true, id)) as ProjectTechDTO;

      if (!getProject) throw new ProjectExceptions.ProjectNotFoundException();

      const currentTechIds = getProject.techs.map((tech) => ({
        id: tech.id,
      })) as TechDTO[];

      const techsToAdd = techsChecked.filter(
        (techId) => !currentTechIds.includes(techId),
      );
      const techsToRemove = currentTechIds.filter((tech) => {
        if (techsToAdd.some((techToAdd) => techToAdd.id === tech.id)) {
          return false;
        }
        return !techsChecked.includes(tech.id);
      });

      const description = projectData.description
        ? projectData.description
        : githubRepo.description;

      const updateProject = await this.prisma.project.update({
        where: { id: +id },
        data: {
          ...projectData,
          description: description ?? null,
          linkRepo: githubRepo.html_url,
          liveSite: githubRepo.homepage,
          githubCreatedAt: new Date(githubRepo.created_at),
          githubUpdatedAt: new Date(githubRepo.pushed_at),
          techs: {
            connect: techsToAdd.map((id) => id),
            disconnect: techsToRemove.map((id) => id),
          },
        },
      });

      if (!updateProject) {
        throw new ProjectExceptions.ProjectUpdateFailedException();
      }

      return updateProject;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided already exists. ${this.prisma.offendingFields(
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

  async deleteProject(id: string): Promise<ProjectDTO | null> {
    try {
      const getProject = await this.findProject(false, id);

      if (!getProject) throw new ProjectExceptions.ProjectNotFoundException();

      const deleteProject = await this.prisma.project.delete({
        where: { id: +id },
      });

      if (!deleteProject)
        throw new ProjectExceptions.ProjectDeletionFailedException();

      return deleteProject;
    } catch (error) {
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided already exists. ${this.prisma.offendingFields(
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

  async findProject(
    techsView?: boolean,
    projectId?: string,
  ): Promise<ProjectDTO | ProjectDTO[] | null> {
    try {
      const includeTechs = techsView ? { techs: true } : {};

      if (!projectId) {
        return (await this.prisma.project.findMany({
          include: includeTechs,
        })) as ProjectDTO[] | null;
      }

      return (await this.prisma.project.findUnique({
        where: { id: +projectId },
        include: includeTechs,
      })) as ProjectDTO | null;
    } catch (error) {
      console.error(error.code);
      switch (error.code) {
        case PrismaError.UniqueConstraintViolation: {
          throw new HttpException(
            {
              reason: 'UniqueConstraintViolation',
              message: `Project with the provided ${this.prisma.offendingFields(
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
              message: `No data was found in the Projects table or the table does not exist`,
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

  async checkingTechIds(techids: string[]) {
    const techsChecked = [];
    const techsNotFound = [];

    for (const tech of techids) {
      const checkeTech = await this.techService.findTech(tech);

      if (checkeTech != null) {
        techsChecked.push({ id: tech });
      } else {
        techsNotFound.push({ id: tech });
      }
    }

    if (techsNotFound.length > 0) {
      throw new HttpException(
        {
          reason: 'TechNotFound',
          message: `As tecnologias de id ${techsNotFound.join(
            ', ',
          )} não foram encontradas.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return techsChecked;
  }
}
