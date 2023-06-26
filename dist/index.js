"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInstance = void 0;
const fastify_1 = __importDefault(require("fastify"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const auth_1 = __importDefault(require("@fastify/auth"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const router_1 = __importDefault(require("./router"));
const admin_1 = __importDefault(require("./router/admin"));
const client_1 = __importDefault(require("./router/client"));
const websocket_2 = __importDefault(require("./router/websocket"));
const decorator_1 = require("./decorator");
const swaggerHook_1 = require("./hook/swaggerHook");
const app = (0, fastify_1.default)({
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
app.addContentTypeParser("application/json", { parseAs: "string" }, function (request, body, done) {
    try {
        done(null, JSON.parse(body));
    }
    catch (error) {
        error.statusCode = 400;
        done(error, undefined);
    }
});
app.register(auth_1.default, { defaultRelation: "and" });
app.register(websocket_1.default, {
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
app.register(swagger_1.default, swaggerHook_1.fastifySwaggerOptions);
app.register(swagger_ui_1.default, swaggerHook_1.fastifySwaggerUiOptions);
app.register(jwt_1.default, {
    secret: process.env["SECRET_KEY"] || "local secret",
});
app
    .decorate("verifyVIP", decorator_1.verifyVIP)
    .decorate("verifyLevel", decorator_1.verifyLevel)
    .decorate("asyncVerifyJWT", decorator_1.asyncVerifyJWT)
    .decorate("validateParamsID", decorator_1.validateParamsID)
    .decorate("verifyUserPassword", decorator_1.verifyUserPassword)
    .decorate("isAuthenticated", decorator_1.isAuthenticated)
    .decorate("validatePaginationRequestQuery", decorator_1.validatePaginationRequestQuery);
app.register(formbody_1.default);
app.register(router_1.default, { prefix: "server" });
app.register(admin_1.default, { prefix: "admin" });
app.register(client_1.default, { prefix: "client" });
app.register(websocket_2.default, { prefix: "websocket" });
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
function fastifyApp(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        yield app.ready();
        app.swagger();
        app.server.emit("request", request, reply);
    });
}
exports.appInstance = app;
exports.index = fastifyApp;
