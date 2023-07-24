import { findUserByDeviceId, saveUser } from "../repositories/users-repository";
import { CreateUserRequestBody } from "../@types/user-types";

export const initializeUserByDeviceId = async (deviceId: string) => {
  const user = await getUserByDeviceId(deviceId);
  return user || (await createUser({ deviceId }));
};

export const getUserByDeviceId = async (id: string) => findUserByDeviceId(id);

export const getUserByDeviceIdOrFailed = async (id: string) => {
  const user = await findUserByDeviceId(id);
  if (user == null) {
    throw new Error("User not found");
  }
  return user;
};

export const createUser = async (body: CreateUserRequestBody) => saveUser(body);
