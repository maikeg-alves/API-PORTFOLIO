import { IsArray, IsOptional } from 'class-validator';
import { ProjectDTO } from './project.dto';
import { TechDTO } from 'src/tech/dto/tech.dto';

export class ProjectAndTechsDTO extends ProjectDTO {
  @IsArray()
  techs: string[];
}
