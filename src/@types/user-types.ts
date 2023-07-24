export interface User {
  id: string;
  deviceId: string;
}

export type CreateUserRequestBody = Omit<User, "id">;

export type UpdateUserRequestBody = Partial<Omit<User, "id">>;
