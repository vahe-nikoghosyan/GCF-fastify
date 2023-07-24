import "@fastify/websocket";

declare module "@fastify/websocket" {
  interface SocketStream {
    id: string;
  }
}
