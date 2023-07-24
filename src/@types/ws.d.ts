export type WSAction = "PING" | "HANDSHAKE";

export type Action = "CONNECTION";

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

export interface WSRequestHeader extends WSHeader {
  requestId: string;
  connectionId?: string;
  deviceId?: string;
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
