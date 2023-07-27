import { DatabaseEntity } from "./util-types";

export interface UserProfile extends DatabaseEntity {
  balance: UserProfileBalance;
  progress: UserProfileProgress;
}

export interface UserProfileBalance {
  coin: number;
  spin: number;
}

export interface UserProfileProgress {
  currentTowerLevel: number;
}

export type CreateUserProfileRequestBody = Omit<
  UserProfile,
  keyof DatabaseEntity
>;
export type UpdateUserProfileRequestBody = Partial<
  Omit<UserProfile, keyof DatabaseEntity>
>;
