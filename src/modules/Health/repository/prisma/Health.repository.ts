import { prisma } from '@/infra/database/prisma';
import type { IHealthRepository } from '../IHealthRepository';

export class PrismaHealthRepository implements IHealthRepository {
  async pingDatabase(): Promise<void> {
    await prisma.$queryRaw`SELECT 1`;
  }
}
