import { FastifyInstance } from "fastify";
import { generateUUID } from "../../utils/uuid";
import { handleAction, validateWSBody } from "../../factories/ws-factory";

export default async (app: FastifyInstance) => {
  app.get("/", { websocket: true }, (connection, request) => {
    const { headers, params, query, method, url } = request;
    console.log("Headers:", headers);
    console.log("Params:", params);
    console.log("Query:", query);
    console.log("Method:", method);
    console.log("URL:", url);

    const connectionId = generateUUID();

    // TODO: add connection in db

    connection.socket.on("message", async (message: string) => {
      try {
        const wsBody = JSON.parse(message);
        validateWSBody(wsBody);

        await handleAction(wsBody, connection);
      } catch (error) {
        console.error("Error parsing incoming message:", error);
        throw new Error("Error parsing incoming message");
      }
    });

    connection.socket.on("close", () => {
      console.log(`closed: ${connectionId}`);
      // TODO: remove connection from db
    });

    connection.socket.on("error", (error: Error) => {
      console.log("error", error);
    });
  });
};
