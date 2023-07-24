import { FastifyRequest, FastifyReply } from "fastify";
import {  HTTP_STATUS_CODES } from "../utils/constants";
import { ParamsID } from "../@types/api-types";



export const validateParamsID = (
  request: FastifyRequest<{ Params: ParamsID }>,
  reply: FastifyReply,
) => {
  const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!(id && id.length)) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({ error: "Invalid ID" });
  }
  request.params.id = id;
};
