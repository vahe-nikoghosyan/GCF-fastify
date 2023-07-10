import { FastifyInstance } from "fastify";
import {
  createSubscription,
  publishMessage,
} from "../../controllers/pub-sub-controller";

export default async (app: FastifyInstance) => {
  app.post("/subscription", createSubscription);

  app.post("/publish-message", publishMessage);
};
