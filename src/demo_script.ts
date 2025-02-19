import { PrismaClient, User, Post } from "@prisma/client";

const prisma = new PrismaClient();

async function create_user() {
  // create a user
  const user: User = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      name: "John Doe",
    },
  });
  console.log("User created", user);
  return user;
}

async function create_post(user: User) {
  const post: Post = await prisma.post.create({
    data: {
      title: "My First Post",
      content: "This is my first post",
      published: true,
      authorId: user.id,
    },
  });
  console.log("Post created: ", post);
  return post;
}

async function fetch_all_posts() {
  const posts = await prisma.post.findMany({
    include: { author: true },
  });

  console.log("Posts created", posts);
  return posts;
}

async function fetch_all_users() {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });
  return users;
}

async function main() {
  try {
    // const userJohn = await create_user();
    // const postFromJohn = await create_post(userJohn);
    await fetch_all_posts();
    await fetch_all_users();
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
