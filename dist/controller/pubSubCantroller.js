"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessage = exports.createSubscription = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";
const topicName = "projects/dulcet-day-241310/topics/first";
const pubSubClient = new pubsub_1.PubSub({
    keyFilename: keyFilePath,
});
function createSubscription(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subscriptionName, filter } = request.body;
        const topic = pubSubClient.topic(topicName);
        const options = {};
        if (filter) {
            const filterExpression = `attributes.${filter.filterAttribute}="${filter.filterValue}"`;
            options["filter"] = filterExpression;
        }
        try {
            const [subscription] = yield topic.createSubscription(subscriptionName, options);
            console.log(`Subscription ${subscriptionName} created.`);
            subscription.on("message", backgroundProcess);
            reply.status(200).send(`Subscription ${subscriptionName} created.`);
        }
        catch (error) {
            console.error("Error creating subscription:", error);
            reply.status(400).send("Error creating subscription!");
        }
    });
}
exports.createSubscription = createSubscription;
function publishMessage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, filterValue } = request.body;
        const attributes = {};
        if (filterValue) {
            attributes["filterAttribute"] = filterValue;
        }
        const dataBuffer = Buffer.from(data);
        try {
            const messageId = yield pubSubClient
                .topic(topicName)
                .publish(dataBuffer, attributes);
            console.log(`Message ${messageId} published.`);
            reply.status(200).send(`Message ${messageId} published.`);
        }
        catch (error) {
            console.error("Error publishing message:", error);
            reply.status(400).send("Error publishing message");
        }
    });
}
exports.publishMessage = publishMessage;
function backgroundProcess(message) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Background process started:", message.data.toString());
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Background process completed:", message.data.toString());
    });
}
