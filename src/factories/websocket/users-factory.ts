import {
  findUserById,
  findUsersList,
} from "../../repositories/users-repository";
import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../../@types/ws";
import { sendWSMessage, throwWSError } from "./ws-factory";
import logger from "../../logger";

const log = logger.child({ from: "WS Users Factory" });

export const wsGetAllUsers = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  try {
    const { users } = await findUsersList();
    if (!users) {
      return throwWSError(connection, header.action, "Users not found.");
    }
    return sendWSMessage(
      connection,
      {
        action: header.action,
        requestId: header.requestId,
        type: "CONFIRM",
      },
      { users },
    );
  } catch (error) {
    log.error("error", error);
    return throwWSError(connection, header.action, "Error while getting.");
  }
};

export const wsGetUserByID = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const id = header.params?.id;
  if (!id) {
    return throwWSError(connection, header.action, "Invalid ID.");
  }
  try {
    const user = await findUserById(id);
    if (!user) {
      return throwWSError(connection, header.action, "User not found.");
    }

    return sendWSMessage(
      connection,
      {
        action: header.action,
        requestId: header.requestId,
        type: "CONFIRM",
      },
      { user },
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return throwWSError(connection, header.action, "Error while getting.");
  }
};
