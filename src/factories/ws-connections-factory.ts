import {
  findWSConnectionById,
  modifyWSConnectionById,
  removeWSConnectionById,
  saveWSConnectionWithSpecificId,
} from "../repositories/ws-connection-repository";
import { UpdateWSConnectionRequestBody } from "../@types/ws-connection";
import logger from "../logger";

const log = logger.child({ from: "WS Connections Factory" });

export const getWSConnectionById = async (id: string) => {
  try {
    const wsConnection = await findWSConnectionById(id);
    if (wsConnection == null) {
      return null;
    }
    return wsConnection;
  } catch (error) {
    log.error("Error retrieving user:", error);
    return null;
  }
};

export const createWSConnection = async (id: string) =>
  saveWSConnectionWithSpecificId({ id });

export const updateWSConnection = async (
  id: string,
  body: UpdateWSConnectionRequestBody,
) => {
  try {
    const wsConnection = await getWSConnectionById(id);
    if (wsConnection == null) {
      return null;
    }
    await modifyWSConnectionById(id, body);
    return true;
  } catch (error) {
    log.error("Error updating ws connection:", error);
    return null;
  }
};

export const deleteWSConnectionById = async (id: string) => {
  try {
    const wsConnection = await getWSConnectionById(id);
    if (wsConnection == null) {
      return null;
    }
    await removeWSConnectionById(id);
    return true;
  } catch (error) {
    log.error("Error deleting ws connection:", error);
    return null;
  }
};
