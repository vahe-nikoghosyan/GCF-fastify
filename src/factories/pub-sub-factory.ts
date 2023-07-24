import { Attributes, PubSub } from "@google-cloud/pubsub";
import { google } from "@google-cloud/pubsub/build/protos/protos";
import { FastifyReply, FastifyRequest } from "fastify";
import { HTTP_STATUS_CODES } from "../utils/constants";
import PubsubMessage = google.pubsub.v1.PubsubMessage;
import logger from "../logger";

const log = logger.child({ from: "Pub Sub Factory" });

const keyFilePath = "keyfile.json";
const topicName = "projects/dulcet-day-241310/topics/first";

const pubSubClient = new PubSub({
  keyFilename: keyFilePath,
});

export const createSubscription = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { subscriptionName, filter } = request.body as {
    subscriptionName: string;
    filter?: {
      filterValue: string;
      filterAttribute: string;
    };
  };

  const topic = pubSubClient.topic(topicName);
  const options: Attributes = {};
  if (filter) {
    const filterExpression = `attributes.${filter.filterAttribute}="${filter.filterValue}"`;
    options["filter"] = filterExpression;
  }

  try {
    const [subscription] = await topic.createSubscription(
      subscriptionName,
      options,
    );
    log.info(`Subscription ${subscriptionName} created.`);

    subscription.on("message", backgroundProcess);
    reply
      .status(HTTP_STATUS_CODES.OK)
      .send(`Subscription ${subscriptionName} created.`);
  } catch (error) {
    log.error("Error creating subscription:", error);
    reply
      .status(HTTP_STATUS_CODES.BadRequest)
      .send("Error creating subscription!");
  }
};

export const publishMessage = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { data, filterValue } = request.body as {
    data: string;
    filterValue: string;
  };

  const attributes: Attributes = {};
  if (filterValue) {
    attributes["filterAttribute"] = filterValue;
  }
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient
      .topic(topicName)
      .publish(dataBuffer, attributes);

    log.info(`Message ${messageId} published.`);
    reply.status(HTTP_STATUS_CODES.OK).send(`Message ${messageId} published.`);
  } catch (error) {
    log.error("Error publishing message:", error);
    reply.status(HTTP_STATUS_CODES.BadRequest).send("Error publishing message");
  }
};

export const backgroundProcess = async (message: PubsubMessage) => {
  log.info("Background process started:", message.data.toString());

  await new Promise((resolve) => setTimeout(resolve, 5000));

  log.info("Background process completed:", message.data.toString());
};
