import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NAMESPACES } from './config';
import { PrismaModule } from './config/prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TechModule } from './tech/tech.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: NAMESPACES,
    }),
    AuthModule,
    PrismaModule,
    ProjectsModule,
    TechModule,
    GithubModule,
  ],
})
export class AppModule {}
