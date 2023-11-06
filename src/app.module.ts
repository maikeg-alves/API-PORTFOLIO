import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NAMESPACES } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ProjectsModule } from './projects/projects.module';
import { TechModule } from './tech/tech.module';
import { JwtModule } from '@nestjs/jwt';
import { GithubService } from './github/github.service';
import { GithubModule } from './github/github.module';

/* @Global() */
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
    MailModule,
    ProjectsModule,
    TechModule,
    GithubModule,
  ],
})
export class AppModule {}
