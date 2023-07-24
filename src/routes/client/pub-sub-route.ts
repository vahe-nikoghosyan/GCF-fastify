import { FastifyInstance } from "fastify";
import {
  createSubscription,
  publishMessage,
} from "../../factories/pub-sub-factory";

export default async (app: FastifyInstance) => {
  app.post("/subscription", createSubscription);

  app.post("/publish-message", publishMessage);
};
