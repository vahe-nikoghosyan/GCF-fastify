import { FastifyInstance } from "fastify";

import adminRoutes from "./admin";
import clientRoutes from "./client";
import websocketRoutes from "./websocket";

export default async (app: FastifyInstance) => {
  app.register(adminRoutes, { prefix: "/admin" });
  app.register(clientRoutes, { prefix: "/client" });
  app.register(websocketRoutes, { prefix: "/websocket" });
};
