export interface WSConnection {
  id: string;
  userId?: string;
}

export type CreateWSConnectionRequestBody = Omit<WSConnection, "id">;

export type UpdateWSConnectionRequestBody = Partial<Omit<WSConnection, "id">>;
