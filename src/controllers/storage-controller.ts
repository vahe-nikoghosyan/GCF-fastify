import { Storage } from "@google-cloud/storage";
import { GetSignedUrlConfig } from "@google-cloud/storage/build/src/file";
import { FastifyReply, FastifyRequest } from "fastify";
import { HTTP_STATUS_CODES } from "../utils/constants";

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
    reply.status(HTTP_STATUS_CODES.OK).type("text").send(fileContent);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(HTTP_STATUS_CODES.InternalServerError)
      .send("Error getting file.");
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

    reply.type("image/png").status(HTTP_STATUS_CODES.OK).send(fileContent);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(HTTP_STATUS_CODES.InternalServerError)
      .send("Error getting image.");
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

    reply.status(HTTP_STATUS_CODES.OK).send(url);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(HTTP_STATUS_CODES.InternalServerError)
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
      reply.status(HTTP_STATUS_CODES.BadRequest).send("File name required");
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

    reply.status(HTTP_STATUS_CODES.OK).send(url);
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(HTTP_STATUS_CODES.InternalServerError)
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

    reply.status(HTTP_STATUS_CODES.OK).send("File uploaded successfully!");
  } catch (err) {
    console.log("err", err);
    reply
      .status(HTTP_STATUS_CODES.InternalServerError)
      .send("Error uploading file.");
  }
};
