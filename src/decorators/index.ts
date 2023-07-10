// import { appInstance } from "../index";
import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify";
import { QueryOptions, StatusCode } from "../utils/constants";
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
  const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!(id && id.length)) {
    reply.status(StatusCode.BAD_REQUEST).send({ error: "Invalid ID" });
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

export function validatePaginationRequestQuery(
  request: FastifyRequest<{
    Params: { id: string };
    Querystring: { offset: number; limit: number };
  }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
): void {
  const requestQuery = request.query;

  if (!Object.keys(requestQuery).length) {
    done();
  }

  const { offset, limit } = requestQuery;

  if (offset != null && offset < 1) {
    reply
      .status(StatusCode.BAD_REQUEST)
      .send({ message: "Offset should be greater than 0" });
  }

  if (limit != null && limit > QueryOptions.MAXIMUM_LIMIT_OF_LIST) {
    reply.status(StatusCode.BAD_REQUEST).send({
      message: `Limit should be smaller than ${QueryOptions.MAXIMUM_LIMIT_OF_LIST}`,
    });
  }

  if (limit != null && limit < QueryOptions.MINIMUM_LIMIT_OF_LIST) {
    reply.status(StatusCode.BAD_REQUEST).send({
      message: `Limit should be greater than ${QueryOptions.MINIMUM_LIMIT_OF_LIST}`,
    });
  }
  done();
}

export function isAuthenticated(
  request: FastifyRequest<{ Headers: { Authorization: string } }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) {
  const token = request.headers.authorization;

  try {
    // appInstance.jwt.verify(token);
    done();
  } catch (error) {
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Invalid token.",
    });
  }
}

export const validateUserCreateRequest = (
  request: FastifyRequest<{ Params: ParamsID }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {};
