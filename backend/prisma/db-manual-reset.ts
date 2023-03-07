// filename: db-manual-reset.ts

// use: npx ts-node ./prisma/db-manual-reset.ts

// add more tables if Required
const tableNames = ['Post', 'User', 'Tag'];

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  for (const tableName of tableNames)
    await prisma.$queryRawUnsafe(
      `Truncate "${tableName}" restart identity cascade;`
    );
}

main().finally(async () => {
  await prisma.$disconnect();
});
