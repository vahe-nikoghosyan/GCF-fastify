import { FastifyInstance } from "fastify";
import { generateUUID } from "../../utils/uuid";
import {
  getWSPayloadFromString,
  handleWSAction,
  throwWSError,
} from "../../factories/ws-factory";
import logger from "../../logger";

const log = logger.child({ from: "WS Router" });

export default async (app: FastifyInstance) => {
  app.get("/", { websocket: true }, (connection, request) => {
    const { headers, params, query, method, url } = request;
    log.info("Headers:", headers);
    log.info("Params:", params);
    log.info("Query:", query);
    log.info("Method:", method);
    log.info("URL:", url);

    const connectionId = generateUUID();

    // TODO: add connection in db

    connection.socket.on("message", async (message: string) => {
      log.info(`received: ${message}`);

      const payload = getWSPayloadFromString(message);

      if (payload == null) {
        return throwWSError(
          connection,
          "PING",
          "Error parsing incoming message"
        );
      }

      try {
        // TODO: body validation
        // validateWSBody(wsBody);

        await handleWSAction(connection, payload.header, payload.body);
      } catch (e) {
        const error = e as Error;
        log.error(`Error parsing incoming message: ${JSON.stringify(error)}`);
        return throwWSError(connection, payload.header.action, error.message);
      }
    });

    connection.socket.on("close", () => {
      log.info(`closed: ${connectionId}`);
      // TODO: remove connection from db
    });

    connection.socket.on("error", (error: Error) => {
      log.info("error", error);
    });
  });
};
