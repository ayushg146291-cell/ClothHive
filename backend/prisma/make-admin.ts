import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('❌ Please provide an email address. Example: npm run make-admin your@email.com');
    process.exit(1);
  }

  console.log(`🔍 Looking for user with email: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User not found! You must log in to the website first using Google/GitHub so your account is created.`);
    process.exit(1);
  }

  if (user.role === 'ADMIN') {
    console.log(`✅ ${email} is already an ADMIN.`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`🎉 SUCCESS! ${email} has been promoted to ADMIN.`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
