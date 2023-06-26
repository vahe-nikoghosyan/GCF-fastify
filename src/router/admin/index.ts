import { FastifyInstance } from "fastify";
import { usersRoute } from "./users-route";

export default async function adminRoute(app: FastifyInstance) {
  app.register(usersRoute, { prefix: "/users" });
}
