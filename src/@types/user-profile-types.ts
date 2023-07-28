import { DatabaseEntity } from "./util-types";

export interface UserProfile extends DatabaseEntity {}

export type CreateUserProfileRequestBody = Omit<
  UserProfile,
  keyof DatabaseEntity
>;
export type UpdateUserProfileRequestBody = Partial<
  Omit<UserProfile, keyof DatabaseEntity>
>;
