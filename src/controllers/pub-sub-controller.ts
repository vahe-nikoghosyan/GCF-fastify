import { Attributes, PubSub } from "@google-cloud/pubsub";
import { google } from "@google-cloud/pubsub/build/protos/protos";
import PubsubMessage = google.pubsub.v1.PubsubMessage;
import { FastifyReply, FastifyRequest } from "fastify";

const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";
const topicName = "projects/dulcet-day-241310/topics/first";

const pubSubClient = new PubSub({
  keyFilename: keyFilePath,
});

export const createSubscription = async (
  request: FastifyRequest,
  reply: FastifyReply
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
      options
    );
    console.log(`Subscription ${subscriptionName} created.`);

    subscription.on("message", backgroundProcess);
    reply.status(200).send(`Subscription ${subscriptionName} created.`);
  } catch (error) {
    console.error("Error creating subscription:", error);
    reply.status(400).send("Error creating subscription!");
  }
};

export const publishMessage = async (
  request: FastifyRequest,
  reply: FastifyReply
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

    console.log(`Message ${messageId} published.`);
    reply.status(200).send(`Message ${messageId} published.`);
  } catch (error) {
    console.error("Error publishing message:", error);
    reply.status(400).send("Error publishing message");
  }
};

export const backgroundProcess = async (message: PubsubMessage) => {
  console.log("Background process started:", message.data.toString());

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Background process completed:", message.data.toString());
};
