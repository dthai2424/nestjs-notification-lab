import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed database...');

  // Xóa dữ liệu cũ nếu có
  await prisma.groupMember.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.group.deleteMany({});

  // Tạo group DEV_TEAM
  const devGroup = await prisma.group.create({
    data: {
      name: 'DEV_TEAM',
    },
  });

  // Tạo group MARKETING
  const marketingGroup = await prisma.group.create({
    data: {
      name: 'MARKETING',
    },
  });

  // Tạo 3 users mẫu
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
    },
  });

  // Gán Alice & Bob vào DEV_TEAM
  await prisma.groupMember.createMany({
    data: [
      { userId: user1.id, groupId: devGroup.id },
      { userId: user2.id, groupId: devGroup.id },
      { userId: user3.id, groupId: marketingGroup.id },
    ],
  });

  console.log('✅ Seed database finished successfully!');
  console.log(`- Created Group: DEV_TEAM (Members: alice@example.com, bob@example.com)`);
  console.log(`- Created Group: MARKETING (Members: charlie@example.com)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
