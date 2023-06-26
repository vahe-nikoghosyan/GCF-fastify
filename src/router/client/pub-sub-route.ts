import { FastifyInstance } from "fastify";
import {
  createSubscription,
  publishMessage,
} from "../../controller/pubSubCantroller";

export async function pubSubRoute(app: FastifyInstance) {
  app.post("/subscription", createSubscription);

  app.post("/publish-message", publishMessage);
}
