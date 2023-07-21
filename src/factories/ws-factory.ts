import { SocketStream } from "@fastify/websocket";
import {
  WSAction,
  WSRequestBody,
  WSRequestHeader,
  WSResponseHeader,
  WSRequestMessage,
} from "../@types/ws";
import logger from "../logger";

const log = logger.child({ from: "WS Factory" });

export const sendWSMessage = (
  connection: SocketStream,
  header: WSResponseHeader,
  body?: any
) => connection.socket.send(JSON.stringify({ header, body }));

export const throwWSError = (
  connection: SocketStream,
  action: WSAction,
  message?: string
) => sendWSMessage(connection, { type: "ERROR", action }, { message });

export const onPing = async (
  connection: SocketStream,
  header: WSRequestHeader
) => {
  log.info(`onPing connection ${JSON.stringify(connection)}`);
  return sendWSMessage(connection, {
    action: header.action,
    requestId: header.requestId,
    type: "CONFIRM",
  });
};

export const onHandshake = async (
  connection: SocketStream,
  header: WSRequestHeader
) => {
  log.info(`onHandshake connection ${JSON.stringify(connection)}`);
  //   TODO: handle auth
  return sendWSMessage(connection, {
    action: header.action,
    requestId: header.requestId,
    type: "CONFIRM",
  });
};

export const handleWSAction = async (
  connection: SocketStream,
  header: WSRequestHeader,
  body: WSRequestBody
) => {
  switch (header.action) {
    case "PING":
      return onPing(connection, header);
    case "HANDSHAKE":
      log.info(`Received HANDSHAKE: ${body}`);
      //   sendWSMessage(connection, "Receive back", WS_ACTIONS.RESPONSE);
      return onHandshake(connection, header);
    default:
      log.error(`Unknown action type:  ${header.action}`);
      return throwWSError(connection, header.action, "Unknown action type");
  }
};

export const getWSPayloadFromString = (message: string) => {
  try {
    return JSON.parse(message) as WSRequestMessage;
  } catch (error) {
    log.error(`Error parsing incoming message: ${JSON.stringify(error)}`);
    return null;
  }
};
