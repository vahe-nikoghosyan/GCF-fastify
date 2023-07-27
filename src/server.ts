import WebSocketServer from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastify from "fastify";

import logger from "./logger";
import routes from "./routes";

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = "0.0.0.0";

const server = fastify({ logger });

export const initialize = async () => {
  server.register(WebSocketServer);
  server.register(fastifyMultipart);
  server.register(routes, { prefix: "/api" });

  const port = Number(process.env.PORT) || DEFAULT_PORT;
  console.log("NODE_ENV", process.env.PORT, process.env.NODE_ENV);

  await server.ready();

  try {
    await server.listen({ port, host: DEFAULT_HOST });
  } catch (error) {
    server.log.warn("Error while server", error);
    process.exit(1);
  }

  return server;
};

export default server;
