import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NAMESPACES } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ProjectsModule } from './projects/projects.module';
import { TechModule } from './tech/tech.module';
import { JwtModule } from '@nestjs/jwt';

/* @Global() */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: NAMESPACES,
    }),
    /* JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.secret'),
      }),
    }), */
    AuthModule,
    PrismaModule,
    MailModule,
    ProjectsModule,
    TechModule,
  ],
})
export class AppModule {}
