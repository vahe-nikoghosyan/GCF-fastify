import { FastifyInstance } from "fastify";
import {
  createSignedUrl,
  getFile,
  getImage,
  getSignedUrl,
  uploadFile,
} from "../../controllers/storage-controller";

export default async (app: FastifyInstance) => {
  app.get("/file", getFile);

  app.get("/image", getImage);

  app.get("/signed-url", getSignedUrl);

  app.post("/signed-url", createSignedUrl);

  app.post("/upload-file", uploadFile);
};
