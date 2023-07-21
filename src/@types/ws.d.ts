import { WS_ACTIONS } from "../utils/constants";

export interface WSBody {
  header: string;
  action: WsRequestAction;
}

export interface WsRequestAction {
  type: WsActions;
  payload?: string;
}

export interface WsResponseAction {
  type: WsActions;
  payload?: string;
}

export type WsActions = keyof typeof WS_ACTIONS;
