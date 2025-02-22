import { prisma } from "../dbclient";
import { Request, Response } from "express";
import { IUser } from "../utils";

export const fetchAllUsers = async (req: Request, resp: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });
    resp.json(users);
  } catch (error) {
    resp.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUserById = async (req: Request, resp: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    resp.json(deletedUser);
  } catch (error) {
    resp.status(500).json({ error: "Failed to delete user" });
  }
};

export const getUserById = async (req: Request, resp: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      resp.json({ error: "Can't find the requested user" });
    }
    resp.json(user);
  } catch (error) {
    resp.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req: Request, resp: Response) => {
  try {
    const user: IUser = req.body;
    const userProps = Object.getOwnPropertyNames(user);
    if (!userProps.includes("email")) {
      resp.status(422).json({ error: "Invalid body:email must be included" });
    } else {
      const newUser = {} as IUser;
      newUser.email = user.email;
      if (userProps.includes("name")) {
        newUser.name = user.name;
      }
      const createdUser = await prisma.user.create({
        data: { ...newUser },
      });
      resp.json(createdUser);
    }
  } catch (error) {
    resp.status(500).json({ error: "Can't create user" });
  }
};
