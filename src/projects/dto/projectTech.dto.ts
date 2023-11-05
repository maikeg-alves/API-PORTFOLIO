import { TechDTO } from 'src/tech/dto/tech.dto';
import { IsArray } from 'class-validator';
import { ProjectDTO } from './project.dto';

export class ProjectTechDTO extends ProjectDTO {
  @IsArray()
  techs: TechDTO[];
}
