import { FastifyInstance } from "fastify";
import userRoutes from "./users-route";
import storageRoutes from "./storage-route";
import pubSubRoutes from "./pub-sub-route";

export default async (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: "/users" });
  app.register(storageRoutes, { prefix: "/storage" });
  app.register(pubSubRoutes, { prefix: "/pub-sub" });
};
