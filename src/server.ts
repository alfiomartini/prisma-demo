import express, { Request, Response } from "express";
import { prisma } from "./dbclient";
import { PrismaUserRepository } from "./repositories/UserRepository";
import { UserController } from "./controllers/UserController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

const userRepository = new PrismaUserRepository(prisma);
const userController = new UserController(userRepository);

app.get("/", (_req: Request, resp: Response) => {
  resp.send("Wellcome to prisma demo API");
});

app.get("/users", userController.fetchAllUsers);
app.get("/users/:id", userController.getUserById);
app.post("/users", userController.createUser);
app.delete("/users/:id", userController.deleteUserById);
app.patch("/users/:id", userController.updateUserById);
app.all("*", (_req, resp) => {
  resp.send("You have tried to reach a route that does not exist");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully shut down the server and disconnect Prisma
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Prisma client disconnected");
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
