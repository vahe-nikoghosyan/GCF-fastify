import firestore from "../database";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
} from "../@types/user-types";

export const COLLECTION_NAME = "users";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findUserById = async (id: string) => {
  const user = await collectionRef.doc(id).get();

  if (!user.exists) {
    return null;
  }

  return {
    id: user.id,
    ...user.data(),
  };
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
  return { id: user.id, ...user.data() };
};

export const modifyUserById = async (id: string, body: UpdateUserRequestBody) =>
  collectionRef.doc(id).update(body);

export const removeUserById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveUser = async (body: CreateUserRequestBody) => {
  const user = await collectionRef.add(body);
  return {
    id: user.id,
    deviceId: body.deviceId,
  };
};
