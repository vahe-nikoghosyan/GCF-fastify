import { FastifyInstance } from "fastify";
import { generateUUID } from "../../utils/uuid";
import { sendMessage } from "../../factories/ws-factory";
import { createWsConnection } from "../../factories/ws-connection";
import { removeWsConnectionById } from "../../repositories/ws-connection-repository";

export default async (app: FastifyInstance) => {
  app.get("/", { websocket: true }, (connection, request) => {
    const { headers, params, query, method, url } = request;
    console.log("Headers:", headers);
    console.log("Params:", params);
    console.log("Query:", query);
    console.log("Method:", method);
    console.log("URL:", url);

    const connectionId = generateUUID();

    connection.socket.on("message", async (message: string) => {
      const parsedMessage = JSON.parse(message);

      const wsConnection = await createWsConnection(
        connectionId,
        parsedMessage.body.request,
      );

      sendMessage(connection, wsConnection);
    });

    connection.socket.on("close", async () => {
      console.log(`closed: ${connectionId}`);
      await removeWsConnectionById(connectionId);
    });

    connection.socket.on("error", (error: Error) => {
      console.log("error", error);
    });
  });
};
