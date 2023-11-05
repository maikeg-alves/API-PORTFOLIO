import { Module } from '@nestjs/common';
import { TechController } from './tech.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TechService } from './tech.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TechController],
  providers: [TechService],
  exports: [TechService],
})
export class TechModule {}
