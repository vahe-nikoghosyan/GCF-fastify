import { PubSub } from "@google-cloud/pubsub";

const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";
const topicName = "projects/dulcet-day-241310/topics/first";

const pubSubClient = new PubSub({
  keyFilename: keyFilePath,
});

export async function createSubscription(request, reply) {
  const { subscriptionName, filter } = request.body as {
    subscriptionName: string;
    filter?: {
      filterValue: string;
      filterAttribute: string;
    };
  };

  const topic = pubSubClient.topic(topicName);
  const options = {};
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
}

export async function publishMessage(request, reply) {
  const { data, filterValue } = request.body as {
    data: string;
    filterValue: string;
  };

  const attributes = {};
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
}

async function backgroundProcess(message) {
  console.log("Background process started:", message.data.toString());

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Background process completed:", message.data.toString());
}
