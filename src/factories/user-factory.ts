import {
  findUserByDeviceId,
  modifyUserById,
  saveUser,
} from "../repositories/user-repository";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
} from "../@types/user-types";
import { createUserProfile } from "./user-profile-factory";
import { WSRequestHeader } from "../@types/ws-types";

export const initializeUserByDeviceId = async (deviceId: string) => {
  const user = await getUserByDeviceId(deviceId);

  if (user != null) {
    return user;
  }

  const createdUser = await createUser({
    deviceId,
  });
  await createUserProfile(createdUser.id);
  return createdUser;
};

export const getUserByDeviceId = async (id: string) => findUserByDeviceId(id);

export const getUserByDeviceIdOrFailed = async (id: string) => {
  const user = await findUserByDeviceId(id);
  if (user == null) {
    throw new Error("User not found");
  }
  return user;
};

export const getAuthorizedUser = async (header: WSRequestHeader) => {
  const user = await getUserByDeviceIdOrFailed(header.deviceId);
  // TODO: Set user into session
  return user;
};

export const updateUserById = async (id: string, body: UpdateUserRequestBody) =>
  modifyUserById(id, body);

export const createUser = async (body: Partial<CreateUserRequestBody>) =>
  saveUser(body);
