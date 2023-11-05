import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDTO } from './dto/project.dto';
import { JwtGuard } from 'src/auth/guards/jwt.gurds';
import { ProjectAndTechsDTO } from './dto/projectsAndTechs.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get(':id')
  getOneProject(
    @Param('id') id: string,
    @Query('viewTechs') viewTechs?: boolean,
  ): Promise<ProjectDTO | null> {
    return this.projectService.getOneProject(id, viewTechs);
  }

  @Get()
  getProjects(
    @Query('viewTechs') viewTechs?: boolean,
  ): Promise<ProjectDTO[] | null> {
    return this.projectService.getProjects(viewTechs);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  async createProject(
    @Body() projectData: ProjectAndTechsDTO,
  ): Promise<ProjectDTO | null> {
    return await this.projectService.createProject(projectData);
  }

  @Put('update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  async updateTech(
    @Body() projectData: ProjectAndTechsDTO,
    @Param('id') id: string,
  ): Promise<ProjectDTO> {
    return await this.projectService.updateProject(projectData, id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtGuard)
  async deleteTech(@Param('id') id: string): Promise<ProjectDTO | null> {
    return await this.projectService.deleteProject(id);
  }
}
