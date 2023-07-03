import WebSocketServer from "@fastify/websocket";
import fastify from "fastify";

import adminRoutes from "./routes/admin";
import clientRoutes from "./routes/client";

const server = fastify();

server.register(adminRoutes, clientRoutes);
server.register(WebSocketServer);

export default server;
