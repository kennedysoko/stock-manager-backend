const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

async function main() {
  const dbPath = path.resolve(__dirname, '../dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database...');

  // Only create admin user — no sample products
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123',
      name: 'Admin Kayola',
      role: 'Administrator',
      initials: 'AK',
      bg: '#E53935',
      status: 'Active',
      email: 'admin@stocksmart.mw'
    },
  });
  console.log(`Ensured admin user: ${admin.username}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
