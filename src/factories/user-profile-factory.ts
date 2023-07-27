import {
  findUserProfileById,
  modifyUserProfile,
  saveUserProfile,
} from "../repositories/user-profile-repository";
import {
  UpdateUserProfileRequestBody,
  UserProfile,
} from "../@types/user-profile-types";

export const getUserProfileById = async (id: string) => findUserProfileById(id);

export const getUserProfileByIdOrFail = async (id: string) => {
  const userProfile = await getUserProfileById(id);
  if (userProfile == null) {
    throw new Error("User profile not found");
  }
  return userProfile;
};

export const updateUserProfile = async (
  id: string,
  body: UpdateUserProfileRequestBody,
) => modifyUserProfile(id, body);

export const createUserProfile = async (userId: string) =>
  saveUserProfile(userId);
