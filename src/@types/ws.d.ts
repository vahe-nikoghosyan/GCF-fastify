export type WSAction =
  | "PING"
  | "HANDSHAKE"
  | "GET_ALL_USERS"
  | "GET_USER"
  | "CREATE_WS_CONNECTION"
  | "GET_WS_CONNECTION"
  | "UPDATE_WS_CONNECTION"
  | "DELETE_WS_CONNECTION";

export type WSActionType = "ERROR" | "SUCCESS" | "CONFIRM";

export interface WSMessage<T = WSHeader, R = WSBody> {
  header: T;
  body: R;
}

export type WSRequestMessage = WSMessage<WSRequestHeader, WSBody>;
export type WSResponseMessage = WSMessage<WSResponseHeader, WSBody>;

export interface WSHeader {
  action: WSAction;
}

export interface WSHeaderParams {
  id: string;
}

export interface WSRequestHeader extends WSHeader {
  requestId: string;
  connectionId?: string;
  deviceId?: string;
  params?: WSHeaderParams;
}

export interface WSResponseHeader extends WSHeader {
  requestId?: string;
  type: WSActionType;
}

export interface WSBody {
  payload: string;
}

export interface WSRequestBody {
  payload: string;
}

export interface WSResponseBody {
  payload: string;
}
