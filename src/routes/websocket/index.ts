import { FastifyInstance } from "fastify";

export default async (app: FastifyInstance) => {
  // @ts-ignore
  app.websocketServer.on("connection", (socket, request) => {
    console.log("connection");
    socket.send("connected");
  });

  app.get("/slot", { websocket: true }, (connection, request) => {
    const wss = connection.socket;

    request.log.info("connection slot");
    wss.send("connected in route");

    wss.on("message", (message: string) => {
      // message.toString() === 'hi from client'
      wss.send("hi from wildcard route");
    });
  });

  app.get("/chat", { websocket: true }, (connection, request) => {
    const wss = connection.socket;

    request.log.info("connection chat");
    wss.send("connected chat");

    wss.on("message", (message: string) => {
      // message.toString() === 'hi from client'
      wss.send("hi from chat");
    });
  });
};
