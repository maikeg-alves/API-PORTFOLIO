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
import { TechService } from './tech.service';
import { TechDTO } from './dto/tech.dto';
import { JwtGuard } from 'src/auth/guards/jwt.gurds';

@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @Get(':id')
  getOneTech(
    @Param('id') id: string,
    @Query('viewProjects') viewProjects?: boolean,
  ): Promise<TechDTO | null> {
    return this.techService.getOneTech(id, viewProjects);
  }

  @Get()
  getTechs(
    @Query('viewProjects') viewProjects?: boolean,
  ): Promise<TechDTO[] | null> {
    return this.techService.getTechs(viewProjects);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  async createTech(@Body() techData: TechDTO): Promise<TechDTO | null> {
    return await this.techService.createTech(techData);
  }

  @Put('update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  async updateTech(
    @Body() techData: TechDTO,
    @Param('id') id: string,
  ): Promise<TechDTO> {
    return await this.techService.updateTech(techData, id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtGuard)
  async deleteTech(@Param('id') id: string): Promise<TechDTO | null> {
    return await this.techService.deleteTech(id);
  }
}
