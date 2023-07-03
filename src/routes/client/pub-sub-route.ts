import { FastifyInstance } from "fastify";
import {
  createSubscription,
  publishMessage,
} from "../../controller/pubSubCantroller";

export default async (app: FastifyInstance) => {
  app.post("/subscription", createSubscription);

  app.post("/publish-message", publishMessage);
};
