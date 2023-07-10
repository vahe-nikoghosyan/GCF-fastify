import WebSocketServer from "@fastify/websocket";
import fastify from "fastify";

import adminRoutes from "./routes/admin";
import clientRoutes from "./routes/client";
import websocketRoutes from "./routes/websocket";

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = "0.0.0.0";

const { PORT, NODE_ENV } = process.env;

const server = fastify({
  logger: NODE_ENV !== "local" || {
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
  server.register(adminRoutes, { prefix: "/admin" });
  server.register(clientRoutes, { prefix: "/client" });

  server.register(WebSocketServer);
  server.register(websocketRoutes, { prefix: "/websocket" });

  const port = Number(PORT) || DEFAULT_PORT;
  server.listen({ port, host: DEFAULT_HOST }, (err, address) => {
    console.log(`listen to http://localhost:${port}`);
  });
};

export default server;
