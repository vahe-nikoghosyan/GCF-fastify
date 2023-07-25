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
import { initializeUserByDeviceId } from "./users-factory";

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

  const user = await initializeUserByDeviceId(header.deviceId);
  if (user == null) {
    return throwWSError(
      connection,
      header.action,
      "Error while checking user!",
    );
  }

  const wsConnection = await updateWSConnection(connection.id, {
    userId: user.id,
  });
  if (wsConnection == null) {
    return throwWSError(
      connection,
      header.action,
      "Error while server connecting",
    );
  }
  return sendWSMessage(connection, {
    action: header.action,
    requestId: header.requestId,
    type: "CONFIRM",
  });
};

function getRandomSymbol(dynamicSymbol?: string) {
  const symbols = ["attack", "coin", "shield", "purse", "spin", "raid"];
  if (dynamicSymbol) {
    symbols.push(dynamicSymbol);
  }
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
  _: any,
) => {
  const results = [];
  for (let i = 0; i < 3; i++) {
    results.push(getRandomSymbol());
  }
  return sendWSMessage(
    connection,
    {
      action: header.action,
      requestId: header.requestId,
      type: "CONFIRM",
    },
    { results, coin: 500, point: 5 },
  );
};

export const handleWSAction = async (
  connection: SocketStream,
  header: WSRequestHeader,
  body: WSRequestBody,
) => {
  switch (header.action) {
    case "PING":
      return onPing(connection, header);
    case "HANDSHAKE":
      return onHandshake(connection, header);
    case "SPIN":
      return spin(connection, header, body);
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
