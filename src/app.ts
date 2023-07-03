// const { Storage } = require("@google-cloud/storage");

import { FastifyReply, FastifyRequest } from "fastify";
import serverInstance from "./server";

// const storage = new Storage({
//   keyFilename: "./keyfile.json",
// });

export const app = async (request: FastifyRequest, reply: FastifyReply) => {
  await serverInstance.ready();

  // app.swagger();
  serverInstance.server.emit("request", request, reply);
};
