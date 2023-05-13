import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const kyle = await prisma.user.create({ data: { name: "kyle" } });
  const sally = await prisma.user.create({ data: { name: "sally" } });

  const post1 = await prisma.post.create({
    data: {
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore nemo pariatur cumque labore laudantium debitis voluptas rerum culpa blanditiis nobis, sunt excepturi ea magni quis explicabo magnam, provident est ducimus.",
      title: "Post 1",
    },
  });

  const post2 = await prisma.post.create({
    data: {
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore nemo pariatur cumque labore laudantium debitis voluptas rerum culpa blanditiis nobis, sunt excepturi ea magni quis explicabo magnam, provident est ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore nemo pariatur cumque labore laudantium debitis voluptas rerum culpa blanditiis nobis, sunt excepturi ea magni quis explicabo magnam, provident est ducimus.",
      title: "Post 2",
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: kyle.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      parentId: comment1.id,
      message: "I am a nested comment",
      userId: sally.id,
      postId: post1.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      message: "I am a root comment",
      userId: sally.id,
      postId: post1.id,
    },
  });
}

seed();
