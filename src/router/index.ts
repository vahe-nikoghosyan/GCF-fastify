import { FastifyInstance } from "fastify";
import { StatusCode } from "../types/enum";

export default async function apiRoute(app: FastifyInstance) {
  app.get("/info", (request, reply) => {
    reply.status(StatusCode.OK).send({
      ...process.versions,
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
    });
  });
}
