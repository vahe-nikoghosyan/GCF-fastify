// import { appInstance } from "../index.ts";
import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify";
import { QUERY_OPTIONS, HTTP_STATUS_CODES } from "../utils/constants";
import { ParamsID } from "../@types/api-types";

// declare module "fastify" {
//   interface FastifyInstance {
//     verifyVIP: () => string;
//     verifyLevel: () => string;
//     isAuthenticated: () => void;
//     verifyUserPassword: () => string;
//     validateParamsID: () => void;
//     validatePaginationRequestQuery: () => void;
//     validateUserCreateRequest: () => void;
//     asyncVerifyJWT: () => Promise<string>;
//   }
// }

export const validateParamsID = (
  request: FastifyRequest<{ Params: ParamsID }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  ("");
  const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!(id && id.length)) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({ error: "Invalid ID" });
  }
  request.params.id = id;
  done();
};

export const verifyLevel = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  reply.status(400).send({ error: "ye" });
  done();
};

export const validatePaginationRequestQuery = (
  request: FastifyRequest<{
    Querystring: { offset: number; limit: number };
  }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  const requestQuery = request.query;

  if (!Object.keys(requestQuery).length) {
    done();
  }

  const { offset, limit } = requestQuery;

  if (offset && limit == null) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({
      message: "Limit is required!",
    });
  }

  if (limit && offset == null) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({
      message: "offset is required!",
    });
  }

  if (offset < QUERY_OPTIONS.MinimumLimitOfList) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({
      message: `Offset should be greater than ${QUERY_OPTIONS.MinimumLimitOfList}`,
    });
  }

  if (limit > QUERY_OPTIONS.MaximumLimitOfList) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({
      message: `Limit should be smaller than ${QUERY_OPTIONS.MaximumLimitOfList}`,
    });
  }

  if (limit < QUERY_OPTIONS.MinimumLimitOfList) {
    reply.status(HTTP_STATUS_CODES.BadRequest).send({
      message: `Limit should be greater than ${QUERY_OPTIONS.MinimumLimitOfList}`,
    });
  }
  done();
};

export const isAuthenticated = (
  request: FastifyRequest<{ Headers: { Authorization: string } }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  try {
    // appInstance.jwt.verify(token);
    done();
  } catch (error) {
    reply.status(HTTP_STATUS_CODES.InternalServerError).send({
      error: "Invalid token.",
    });
  }
};
