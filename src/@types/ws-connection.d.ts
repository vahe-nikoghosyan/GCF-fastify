export interface WsConnection {
  id: string;
  userId: string;
}

export interface WsConnectionQueryOptions {
  limit: number;
  page: number;
  offset: number;
}

export interface WsConnectionParams {
  id: string;
}

export interface WsConnectionQuerystring {
  id: string;
  userId: string;
}

export type CreateWsConnectionRequestBody = Omit<WsConnection, "id">;

export type UpdateWsConnectionRequestBody = Partial<Omit<WsConnection, "id">>;
