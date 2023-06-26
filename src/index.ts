import fastify from "fastify";

import Formbody from "@fastify/formbody";
import fastifyJwt from "@fastify/jwt";
import fastifyAuth from "@fastify/auth";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyWebsocket from "@fastify/websocket";

import apiRoute from "./router";
import adminRoute from "./router/admin";
import clientRoute from "./router/client";
import websocketRoute from "./router/websocket";

import {
  asyncVerifyJWT,
  validatePaginationRequestQuery,
  validateParamsID,
  verifyLevel,
  verifyUserPassword,
  verifyVIP,
  isAuthenticated,
} from "./decorator";

import {
  fastifySwaggerOptions,
  fastifySwaggerUiOptions,
} from "./hook/swaggerHook";
import WebSocket from "ws";

const app = fastify({
  logger: true,
});

// const wss = new WebSocket.Server({ noServer: true });
//
// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     console.log("Received message:", message);
//
//     // Process the message or perform any necessary actions
//
//     // Example: Echo the message back to the client
//     ws.send(`You sent: ${message}`);
//   });
//
//   ws.on("close", () => {
//     console.log("WebSocket client disconnected");
//   });
// });

app.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (request, body, done) {
    try {
      done(null, JSON.parse(body as string));
    } catch (error) {
      error.statusCode = 400;
      done(error, undefined);
    }
  }
);

app.register(fastifyAuth, { defaultRelation: "and" });
app.register(fastifyWebsocket, {
  options: { maxPayload: 1048576 },
});

// app.register(
//   async function (fastify) {
//     fastify.get(
//       "/",
//       { websocket: true },
//       (connection /* SocketStream */, req /* FastifyRequest */) => {
//         connection.socket.on("message", (message) => {
//           // message.toString() === 'hi from client'
//           connection.socket.send("hi from server");
//         });
//       }
//     );
//   },
//   { prefix: "websocket" }
// );

app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);

app.register(fastifyJwt, {
  secret: process.env["SECRET_KEY"] || "local secret",
});

app
  .decorate("verifyVIP", verifyVIP)
  .decorate("verifyLevel", verifyLevel)
  .decorate("asyncVerifyJWT", asyncVerifyJWT)
  .decorate("validateParamsID", validateParamsID)
  .decorate("verifyUserPassword", verifyUserPassword)
  .decorate("isAuthenticated", isAuthenticated)
  .decorate("validatePaginationRequestQuery", validatePaginationRequestQuery);

app.register(Formbody);
app.register(apiRoute, { prefix: "server" });
app.register(adminRoute, { prefix: "admin" });
app.register(clientRoute, { prefix: "client" });
app.register(websocketRoute, { prefix: "websocket" });

// app.register((instance, opts, done) => {
//   const wss = new WebSocket.Server({ noServer: true });
//
//   instance.server.on("upgrade", (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//       wss.emit("connection", ws, request);
//     });
//   });
//
//   wss.on("connection", (ws, request) => {
//     ws.on("message", (message) => {
//       console.log("REceved  messabe: ", message.toString());
//       ws.send("Hi from server");
//     });
//
//     ws.on("close", () => {
//       console.log("Closed");
//     });
//
//     console.log("WebSocket connection established:", request.url);
//   });
//
//   done();
// });

// app.get("/", async (request, reply) => {
//   reply.redirect("/documentation");
// });

const port = Number(process.env.PORT) || 8080;

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

async function fastifyApp(request, reply) {
  await app.ready();

  app.swagger();
  app.server.emit("request", request, reply);
}
export const appInstance = app;
exports.index = fastifyApp;
