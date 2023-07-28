import firestore from "../database";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
  User,
} from "../@types/user-types";

import { getDocumentData, createModel } from "../utils/db-utils";

const COLLECTION_NAME = "users";
const collectionRef = firestore.collection(COLLECTION_NAME);

const DEFAULT_USER_BODY = {
  coin: 0,
  spin: 50,
  currentTowerLevel: 1,
};

export const findUserById = async (id: string) => {
  const userSnapshot = await collectionRef.doc(id).get();
  return getDocumentData<User>(userSnapshot);
};

export const findUserByDeviceId = async (deviceId: string) => {
  const userSnapshot = await collectionRef
    .where("deviceId", "==", deviceId)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return null;
  }
  const user = userSnapshot.docs[0];
  return { id: user.id, ...user.data() } as User;
};

export const modifyUserById = async (id: string, body: UpdateUserRequestBody) =>
  collectionRef.doc(id).update(body);

export const removeUserById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveUser = async (body: Partial<CreateUserRequestBody>) => {
  const userModel = createModel({ ...DEFAULT_USER_BODY, ...body });
  const user = await collectionRef.add(userModel);
  return { id: user.id, ...userModel } as User;
};
