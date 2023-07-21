export interface WsConnection {
  id: string;
  userId?: string;
}

export type CreateWsConnectionRequestBody = Omit<WsConnection, "id">;

export type UpdateWsConnectionRequestBody = Partial<Omit<WsConnection, "id">>;
