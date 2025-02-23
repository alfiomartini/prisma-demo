import { IUserRepository } from "../repositories/UserRepository";
import { Request, Response } from "express";
import { User } from "@prisma/client";

export class UserController {
  constructor(private userRepository: IUserRepository) {}

  fetchAllUsers = async (req: Request, resp: Response) => {
    try {
      const users = await this.userRepository.findMany();
      resp.json(users);
    } catch (error) {
      resp.status(500).json({ error: "Failed to fetch users" });
    }
  };

  deleteUserById = async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const deletedUser = await this.userRepository.delete(Number(id));
      resp.json(deletedUser);
    } catch (error) {
      resp.status(500).json({ error: "Failed to delete user" });
    }
  };

  updateUserById = async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const { email, name }: User = req.body;
      if (!email && !name) {
        resp.status(422).json({ error: "needed email or name or both" });
      } else {
        const newUser = {} as User;
        if (email) newUser.email = email;
        if (name) newUser.name = name;
        const updatedUser = await this.userRepository.update(
          Number(id),
          newUser
        );
        resp.json(updatedUser);
      }
    } catch (error) {
      console.log("updateById error", error);
      resp.status(500).json({ error: "Failed to update user" });
    }
  };

  getUserById = async (req: Request, resp: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(Number(id));
      if (!user) {
        resp.json({ error: "Can't find the requested user" });
      }
      resp.json(user);
    } catch (error) {
      resp.status(500).json({ error: "Failed to fetch user" });
    }
  };

  createUser = async (req: Request, resp: Response) => {
    try {
      const user: Omit<User, "id"> = req.body;
      const userProps = Object.getOwnPropertyNames(user);
      if (!userProps.includes("email")) {
        resp.status(422).json({ error: "Invalid body:email must be included" });
      } else {
        const newUser = {} as Omit<User, "id">;
        newUser.email = user.email;
        if (userProps.includes("name")) {
          newUser.name = user.name;
        }
        const createdUser = await this.userRepository.create(newUser);
        resp.json(createdUser);
      }
    } catch (error) {
      resp.status(500).json({ error: "Can't create user" });
    }
  };
}
