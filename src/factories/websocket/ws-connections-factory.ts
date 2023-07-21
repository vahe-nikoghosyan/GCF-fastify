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

const log = logger.child({ from: "WS Connections Factory" });

export const createWSConnection = async (id: string) => {
  try {
    const wsConnection = await saveWSConnectionWithSpecificId({
      id,
    } as WSConnection);
    if (!wsConnection) {
      return new Error("Error while creating");
    }
    return true;
  } catch (error) {
    log.error("Error creating ws connection:", error);
    return null;
  }
};

export const getWSConnectionById = async (id: string) => {
  try {
    return await findWSConnectionById(id);
  } catch (error) {
    log.error("Error retrieving user:", error);
    return null;
  }
};

export const updateWSConnection = async (
  id: string,
  body: UpdateWSConnectionRequestBody,
) => {
  try {
    const wsConnection = await getWSConnectionById(id);

    if (!wsConnection) {
      return null;
    }
    return await modifyWSConnectionById(id, body);
  } catch (error) {
    log.error("Error updating ws connection:", error);
    return null;
  }
};

export const deleteWSConnectionById = async (id: string) => {
  try {
    const wsConnection = await getWSConnectionById(id);

    if (!wsConnection) {
      return null;
    }
    await removeWSConnectionById(id);
    return true;
  } catch (error) {
    log.error("Error deleting ws connection:", error);
    return null;
  }
};
