import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TechModule } from 'src/tech/tech.module';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [PrismaModule, AuthModule, TechModule, GithubModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
