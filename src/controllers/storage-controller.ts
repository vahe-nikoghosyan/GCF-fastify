import { Storage } from "@google-cloud/storage";
import { GetSignedUrlConfig } from "@google-cloud/storage/build/src/file";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCode } from "../utils/constants";

const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";
const bucketName = "bucket_assets_num1";

const storage = new Storage({
  projectId: process.env["PROJECT_ID"] || "",
  keyFilename: keyFilePath,
});

export const getFile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const fileName = "example.txt";

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [fileContent] = await file.download();
    reply.status(StatusCode.OK).type("text").send(fileContent);
  } catch (error) {
    console.error("Error:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send("Error getting file.");
  }
};

export const getImage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fileName = "Hotpot.png";

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [fileContent] = await file.download();

    reply.type("image/png").status(StatusCode.OK).send(fileContent);
  } catch (error) {
    console.error("Error:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send("Error getting image.");
  }
};

export const getSignedUrl = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fileName = "Hotpot.png";

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const options: GetSignedUrlConfig = {
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // URL expiration time in milliseconds
    };

    const [url] = await file.getSignedUrl(options);

    reply.status(StatusCode.OK).send(url);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send("Error getting sign-url.");
  }
};

export const createSignedUrl = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { fileName } = request.body as { fileName: string };

    if (!fileName) {
      reply.status(StatusCode.BAD_REQUEST).send("File name required");
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // URL expiration time in milliseconds
      contentType: "image/png",
    };

    const [url] = await file.getSignedUrl(options);

    reply.status(StatusCode.OK).send(url);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send("Error getting sign-url.");
  }
};

export const uploadFile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const fileName = "example.txt";
    const fileContent = "Hello, Cloud Storage";

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    await file.save(fileContent);

    reply.status(StatusCode.OK).send("File uploaded successfully!");
  } catch (err) {
    console.log("err", err);
    reply
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send("Error uploading file.");
  }
};
