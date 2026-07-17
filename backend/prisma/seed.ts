import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const userPasswordHash = await bcrypt.hash('User123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash: adminPasswordHash, name: 'Admin', role: 'ADMIN' },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', passwordHash: userPasswordHash, name: 'Alice', role: 'USER' },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', passwordHash: userPasswordHash, name: 'Bob', role: 'USER' },
  });

  const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  await prisma.task.deleteMany();

  const owners = [admin, alice, bob];
  let count = 0;
  for (const owner of owners) {
    for (const status of statuses) {
      for (const priority of priorities) {
        count += 1;
        await prisma.task.create({
          data: {
            title: `${owner.name} task ${count} (${status}/${priority})`,
            description: `Seeded task for ${owner.email}`,
            status,
            priority,
            ownerId: owner.id,
          },
        });
      }
    }
  }

  console.log(`Seeded ${owners.length} users and ${count} tasks.`);
  console.log('Admin login: admin@example.com / Admin123!');
  console.log('User logins: alice@example.com / User123!, bob@example.com / User123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
