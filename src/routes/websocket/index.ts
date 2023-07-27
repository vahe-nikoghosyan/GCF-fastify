import { FastifyInstance } from "fastify";
import { generateUUID } from "../../utils/uuid-utils";
import {
  getWSPayloadFromString,
  handleWSAction,
  throwWSError,
} from "../../factories/ws-factory";
import logger from "../../logger";
import {
  createWSConnection,
  deleteWSConnectionById,
} from "../../factories/ws-connections-factory";

const log = logger.child({ from: "WS Router" });

// FIXME: move to d.ts file
declare module "@fastify/websocket" {
  interface SocketStream {
    id: string;
  }
}

export default async (app: FastifyInstance) => {
  app.get("/", { websocket: true }, async (connection, request) => {
    const { headers, params, query, method, url } = request;

    connection.id = generateUUID();
    await createWSConnection(connection.id);

    connection.socket.on("message", async (message: string) => {
      const payload = getWSPayloadFromString(message);

      if (payload == null) {
        return throwWSError(
          connection,
          "PING",
          "Error parsing incoming message",
        );
      }

      try {
        // TODO: body validation
        // validateWSBody(wsBody);

        await handleWSAction(connection, payload.header, payload.body);
      } catch (e) {
        const error = e as Error;
        log.error(`Error: ${JSON.stringify(error)}`);
        return throwWSError(connection, payload.header.action, error.message);
      }
    });

    connection.socket.on("close", async () => {
      log.info(`closed: ${connection.id}`);
      await deleteWSConnectionById(connection.id);
    });

    connection.socket.on("error", (error: Error) => {
      log.info("error", error);
    });
  });
};
