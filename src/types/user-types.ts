export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserQueryOptions {
  limit: number;
  page: number;
  offset: number;
}

export interface UserParams {
  id: string;
}

export interface UserQuerystring {
  username: string;
  password: string;
}

export interface UserHeaders {
  "h-Custom": string;
}

export type CreateUserRequestBody = Omit<User, "id"> & { password: string };

export type UpdateUserRequestBody = Partial<Omit<User, "id">>;
