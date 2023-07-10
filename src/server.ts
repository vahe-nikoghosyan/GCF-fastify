import WebSocketServer from "@fastify/websocket";
import fastify from "fastify";

import adminRoutes from "./routes/admin";
import clientRoutes from "./routes/client";
import websocketRoutes from "./routes/websocket";

const server = fastify();

server.register(adminRoutes, { prefix: "/admin" });
server.register(clientRoutes, { prefix: "/client" });

server.register(WebSocketServer);
server.register(websocketRoutes, { prefix: "/websocket" });

// export default server;
const port = Number(process.env["PORT"]) || 8080;
server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  console.log(`listen to http://localhost:${port}`);
});
