import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  offendingFields(fields: string[]): string {
    if (fields.length === 0) return '';
    else if (fields.length === 1) return fields[0];
    const last = fields.pop();
    return `${fields.join(', ')} and ${last}`;
  }
}
