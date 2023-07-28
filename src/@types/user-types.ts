import { DatabaseEntity } from "./util-types";

export interface User extends DatabaseEntity {
  deviceId: string;
  coin: number;
  spin: number;
  currentTowerLevel: number;
}

export type CreateUserRequestBody = Omit<User, keyof DatabaseEntity>;

export type UpdateUserRequestBody = Partial<Omit<User, keyof DatabaseEntity>>;
