import {
  findWSConnectionById,
  modifyWSConnectionById,
  removeWSConnectionById,
  saveWSConnectionWithSpecificId,
} from "../../repositories/ws-connection-repository";
import {
  UpdateWSConnectionRequestBody,
  WSConnection,
} from "../../@types/ws-connection";
import logger from "../../logger";
import { SocketStream } from "@fastify/websocket";
import { sendWSMessage, throwWSError } from "./ws-factory";
import { WSAction } from "../../@types/ws";

const log = logger.child({ from: "WS Connections Factory" });

export const createWSConnection = async (
  connection: SocketStream,
  id: string,
) => {
  const action: WSAction = "CREATE_WS_CONNECTION";
  try {
    const wsConnection = await saveWSConnectionWithSpecificId({
      id,
    } as WSConnection);
    if (!wsConnection) {
      return throwWSError(
        connection,
        action,
        "Error while creating ws connection.",
      );
    }
    return sendWSMessage(
      connection,
      {
        action,
        type: "SUCCESS",
      },
      { wsConnection },
    );
  } catch (error) {
    log.error("Error creating ws connection:", error);
    return throwWSError(connection, action, "Error while creating.");
  }
};

export const getWSConnectionById = async (
  connection: SocketStream,
  id: string,
) => {
  const action: WSAction = "GET_WS_CONNECTION";
  try {
    const wsConnection = await findWSConnectionById(id);
    if (!wsConnection) {
      return throwWSError(connection, action, "Ws connection not found.");
    }

    return sendWSMessage(
      connection,
      {
        action,
        type: "CONFIRM",
      },
      { wsConnection },
    );
  } catch (error) {
    log.error("Error retrieving user:", error);
    return throwWSError(connection, action, "Error while getting.");
  }
};

export const updateWSConnection = async (
  connection: SocketStream,
  id: string,
  body: UpdateWSConnectionRequestBody,
) => {
  const action: WSAction = "UPDATE_WS_CONNECTION";
  try {
    await getWSConnectionById(connection, id);
    await modifyWSConnectionById(id, body);

    return sendWSMessage(connection, {
      action,
      type: "CONFIRM",
    });
  } catch (error) {
    log.error("Error updating ws connection:", error);
    return throwWSError(connection, action, "Error while updating.");
  }
};

export const deleteWSConnectionById = async (
  connection: SocketStream,
  id: string,
) => {
  const action: WSAction = "UPDATE_WS_CONNECTION";
  try {
    await getWSConnectionById(connection, id);
    await removeWSConnectionById(id);

    return sendWSMessage(connection, {
      action,
      type: "CONFIRM",
    });
  } catch (error) {
    log.error("Error deleting ws connection:", error);
    return throwWSError(connection, action, "Error while getting.");
  }
};
