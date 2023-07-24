import { findUserByDeviceId, saveUser } from "../repositories/users-repository";
import { CreateUserRequestBody } from "../@types/user-types";
import { SocketStream } from "@fastify/websocket";
import logger from "../logger";

const log = logger.child({ from: "Users Factory" });

export const getOrCreateUserByDeviceId = async (
  connection: SocketStream,
  deviceId: string,
) => {
  const user = await findUserByDeviceId(deviceId);

  if (user != null) {
    return user;
  }

  const createdUser = await createUser({ deviceId });
  if (createdUser == null) {
    return null;
  }
  return createdUser;
};

export const createUser = async ({ deviceId }: CreateUserRequestBody) => {
  if (deviceId == null) {
    return null;
  }

  try {
    return await saveUser({ deviceId });
  } catch (error) {
    log.error("Error creating user:", error);
    return null;
  }
};
