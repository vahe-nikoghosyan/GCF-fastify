import { FastifyInstance } from "fastify";

export default async function websocketRoute(app: FastifyInstance) {
  app.get(
    "/*",
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      const wss = connection.socket;

      wss.on("close", (message) => {
        // message.toString() === 'hi from client'
        wss.send("close");
      });

      wss.on("message", (message) => {
        // message.toString() === 'hi from client'
        wss.send("hi from wildcard route");
      });
    }
  );

  app.get(
    "/",
    { websocket: true },
    (connection /* SocketStream */, request /* FastifyRequest */) => {
      const wss = connection.socket;

      wss.on("message", (message) => {
        const { type } = JSON.parse(message.toString()) as {
          type: "join" | "leave" | "create";
        };

        switch (type) {
          case "create":
            console.log("Create");
            wss.send("Created!");
            break;
          case "join":
            console.log("Join");
            wss.send("Joined!");
            break;
          case "leave":
            console.log("Leave");
            wss.send("Leaved!");
            break;
          default:
            console.log(`Unknown type ${type}`);
            break;
        }

        wss.send("hi from server");
      });
    }
  );
}
