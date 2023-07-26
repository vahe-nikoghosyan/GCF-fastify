import { FastifyInstance } from "fastify";
import dataImportRoute from "./data-import-route";

export default async (app: FastifyInstance) => {
  app.register(dataImportRoute, { prefix: "/csv" });
};
