import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Keep your role
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  const email = 'admin@unitedshades.local';
  const password = 'shades';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Joshua Hovis',
      passwordHash,
      timezone: 'America/New_York',
    },
    create: {
      name: 'Joshua Hovis',
      email,
      passwordHash,
      timezone: 'America/New_York',
      phoneRaw: null,
    },
  });

  console.log('Seeded role:', adminRole.name);
  console.log('Seeded user:', user.email);
  console.log('Login credentials:', { email, password });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
