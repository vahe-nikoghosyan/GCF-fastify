import { SocketStream } from "@fastify/websocket";
import { WS_ACTIONS } from "../utils/constants";
import { WsActions, WSBody } from "../@types/ws";

const { HANDSHAKE } = WS_ACTIONS;
export const sendMessage = (
  connection: SocketStream,
  payload: any,
  type: WsActions = "RESPONSE",
) => {
  connection.socket.send(JSON.stringify({ type, payload }));
  return true;
};

export const handleAction = async (body: WSBody, connection: SocketStream) => {
  const action = body.action;

  switch (action.type) {
    case HANDSHAKE:
      console.log("Received HANDSHAKE:", action.payload);
      sendMessage(connection, "Receive back", WS_ACTIONS.RESPONSE);
      break;
    default:
      console.log("Unknown action type:", action.type);
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const validateWSBody = (body: WSBody) => {
  const actions = Object.values(WS_ACTIONS);
  if (body == null || body.action == null) {
    throw new Error("Invalid body!");
  }

  if (!actions.includes(body.action.type)) {
    throw new Error("Unknown action type!");
  }
};
