import { FastifyInstance } from "fastify";
import { usersRoute } from "./users-route";
import { storageRoute } from "./storage-route";
import { pubSubRoute } from "./pub-sub-route";

export default async function clientRoute(app: FastifyInstance) {
  app.register(usersRoute, { prefix: "/users" });
  app.register(storageRoute, { prefix: "/storage" });
  app.register(pubSubRoute, { prefix: "/pub-sub" });
}
