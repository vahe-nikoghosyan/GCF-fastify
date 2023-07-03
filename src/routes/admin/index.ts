import { FastifyInstance } from "fastify";
import userRoutes from "./users-route";

export default async (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: "/users" });
};
