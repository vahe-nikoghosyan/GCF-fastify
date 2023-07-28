import firestore from "../database";
import { createModel } from "../database/db-model";
import {
  UpdateUserProfileRequestBody,
  UserProfile,
} from "../@types/user-profile-types";

export const COLLECTION_NAME = "user_profile";

const collectionRef = firestore.collection(COLLECTION_NAME);

export const findUserProfileById = async (id: string) => {
  const userProfile = await collectionRef.doc(id).get();

  if (!userProfile.exists) {
    return null;
  }

  return {
    id: userProfile.id,
    ...userProfile.data(),
  } as UserProfile;
};

export const modifyUserProfile = async (
  userId: string,
  body: UpdateUserProfileRequestBody,
) => collectionRef.doc(userId).update(body);

export const saveUserProfile = async (userId: string) => {
  const userProfileModel = createModel({});
  await collectionRef.doc(userId).set(userProfileModel);

  return {
    id: userId,
    ...userProfileModel,
  } as UserProfile;
};
