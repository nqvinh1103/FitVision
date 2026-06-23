import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

const SEED_USERS = [
  {
    email: 'admin@gmail.com',
    password: 'admin12345',
    role: Role.ADMIN,
    name: 'Admin',
  },
  {
    email: 'trainer1@gmail.com',
    password: 'trainer12345',
    role: Role.TRAINER,
    name: 'Trainer 1',
  },
] as const;

async function main() {
  for (const user of SEED_USERS) {
    const passwordHash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash, role: user.role, name: user.name },
      create: {
        email: user.email,
        passwordHash,
        role: user.role,
        name: user.name,
      },
    });

    console.log(`Seeded ${user.role}: ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
