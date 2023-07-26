import { SocketStream } from "@fastify/websocket";

export interface WSMessage<T = WSHeader, R = WSBody> {
  header: T;
  body: R;
}

export interface WSHeader {
  action: WSAction;
}

export interface WSRequestHeader extends WSHeader {
  requestId: string;
  deviceId: string;
  token?: string;
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

export interface SocketStreamN extends SocketStream {
  id: string;
}

export type WSRequestMessage = WSMessage<WSRequestHeader, WSBody>;
export type WSResponseMessage = WSMessage<WSResponseHeader, WSBody>;

export type WSAction = "PING" | "HANDSHAKE" | "SPIN";
export type WSActionType = "ERROR" | "SUCCESS" | "CONFIRM";
