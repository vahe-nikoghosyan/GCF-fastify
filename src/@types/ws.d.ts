import { WS_ACTIONS } from "../utils/constants";

// export interface WSBody {
//   header: string;
//   action: WsRequestAction;
// }

// export interface WsRequestAction {
//   type: WsActions;
//   payload?: string;
// }

// export interface WsResponseAction {
//   type: WsActions;
//   payload?: string;
// }

// export type WsActions = keyof typeof WS_ACTIONS;

export type WSAction = "PING" | "HANDSHAKE";

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
