import { FastifyInstance } from "fastify";

import adminRoutes from "./admin";
import clientRoutes from "./client";
import websocketRoutes from "./websocket";
import dataImportRoutes from "./data-import";

export default async (app: FastifyInstance) => {
  app.register(adminRoutes, { prefix: "/admin" });
  app.register(clientRoutes, { prefix: "/client" });
  app.register(dataImportRoutes, { prefix: "/data-import" });
  app.register(websocketRoutes, { prefix: "/websocket" });
};
