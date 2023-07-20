import { SocketStream } from "@fastify/websocket";

export const sendMessage = (connection: SocketStream, message: any) => {
  connection.socket.send(`Server response: ${JSON.stringify(message)}`);
  return true;
};
