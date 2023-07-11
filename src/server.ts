import WebSocketServer from "@fastify/websocket";
import fastify from "fastify";

import apiRoutes from "./routes";
import adminRoutes from "./routes/admin";
import clientRoutes from "./routes/client";
import websocketRoutes from "./routes/websocket";

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = "0.0.0.0";

const server = fastify({
  logger: process.env.NODE_ENV !== "local" || {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

export const initialize = () => {
  server.register(apiRoutes, { prefix: "/" });
  server.register(adminRoutes, { prefix: "/admin" });
  server.register(clientRoutes, { prefix: "/client" });

  server.register(WebSocketServer);
  server.register(websocketRoutes, { prefix: "/websocket" });

  const port = Number(process.env.PORT) || DEFAULT_PORT;

  server.ready((error) => {
    if (error) {
      server.log.warn("🚨 Something went wrong while starting server.");
      throw error;
    }
    server.log.info("✅  Server ready.");
  });
  server.listen({ port, host: DEFAULT_HOST }, (error, address) => {
    if (error) {
      server.log.warn("Error while server", error);
    }
    server.log.info(`🚀 Server listening at http://localhost:${port}`);
  });
};

export default server;
