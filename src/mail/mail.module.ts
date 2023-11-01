import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { CONFIG } from '../config';

@Module({
  imports: [CONFIG.mailConfig],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
