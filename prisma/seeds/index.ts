import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/infra/database/generated/prisma/client';
import { seedOrganizations } from './entities/organization';
import { seedUsers } from './entities/user';

const databaseUrl = process.env.DATABASE_URL ?? '';

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run Prisma seed.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const seeds: Array<(client: PrismaClient) => Promise<void>> = [
  seedOrganizations,
  seedUsers,
];

async function main(): Promise<void> {
  for (const runSeed of seeds) {
    await runSeed(prisma);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
