import { PrismaClient, User, Post } from "@prisma/client";

export interface IUserRepository {
  findMany(): Promise<(User & { posts: Post[] })[]>;
  findById(id: number): Promise<User | null>;
  create(user: Partial<Omit<User, "id">>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<User | null>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(): Promise<(User & { posts: Post[] })[]> {
    const users = this.prisma.user.findMany({
      include: { posts: true },
    });
    return users;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const created = this.prisma.user.create({ data: user });
    return created;
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
    const updated = this.prisma.user.update({ where: { id }, data: user });
    return updated;
  }

  async delete(id: number): Promise<User | null> {
    const deleted = this.prisma.user.delete({ where: { id } });
    return deleted;
  }
}
