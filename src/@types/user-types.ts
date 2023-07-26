import { DatabaseEntity } from "./util-types";

export interface UserProgress {
  currentTowerLevel: number;
}

export interface User extends DatabaseEntity {
  deviceId: string;
  progress: UserProgress;
}

export type CreateUserRequestBody = Omit<User, keyof DatabaseEntity>;

export type UpdateUserRequestBody = Partial<Omit<User, "id">>;
