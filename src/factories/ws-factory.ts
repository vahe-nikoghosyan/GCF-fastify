import { SocketStream } from "@fastify/websocket";
import {
  WSAction,
  WSRequestBody,
  WSRequestHeader,
  WSRequestMessage,
  WSResponseHeader,
} from "../@types/ws-types";
import logger from "../logger";
import { updateWSConnection } from "./ws-connections-factory";
import { getOrCreateUserByDeviceId } from "./users-factory";

const log = logger.child({ from: "WS Factory" });

export const sendWSMessage = (
  connection: SocketStream,
  header: WSResponseHeader,
  body?: any,
) => connection.socket.send(JSON.stringify({ header, ...(body && { body }) }));

export const throwWSError = (
  connection: SocketStream,
  action: WSAction,
  message?: string,
) => sendWSMessage(connection, { type: "ERROR", action }, { message });

export const onPing = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  log.info("onPing connection");

  return sendWSMessage(connection, {
    action: header.action,
    requestId: header.requestId,
    type: "CONFIRM",
  });
};

export const onHandshake = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  if (header.deviceId == null) {
    return throwWSError(connection, header.action, "Invalid device ID.");
  }

  log.info("onHandshake connection");
  // TODO: handle auth

  const user = await getOrCreateUserByDeviceId(connection, header.deviceId);
  if (user == null) {
    return throwWSError(
      connection,
      header.action,
      "Error while checking user!",
    );
  }

  const wsConnection = await updateWSConnection(header.connectionId!, {
    userId: user.id,
  });
  if (wsConnection == null) {
    throwWSError(connection, header.action, "Error while server connecting");
  }
  return sendWSMessage(connection, {
    action: header.action,
    requestId: header.requestId,
    type: "CONFIRM",
  });
};

export const handleWSAction = async (
  connection: SocketStream,
  header: WSRequestHeader,
  _: WSRequestBody,
) => {
  switch (header.action) {
    case "PING":
      return onPing(connection, header);
    case "HANDSHAKE":
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
