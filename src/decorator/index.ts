import { appInstance } from "../index";
import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifyVIP: () => string;
    verifyLevel: () => string;
    isAuthenticated: () => void;
    verifyUserPassword: () => string;
    validateParamsID: () => void;
    validatePaginationRequestQuery: () => void;
    asyncVerifyJWT: () => Promise<string>;
  }
}

import { QueryOptions, StatusCode } from "../types/enum";

export function verifyUserPassword(
  request: FastifyRequest,
  reply: FastifyReply,
  done
): void {
  done({ error: "Wrong password!" });
}

export function verifyLevel(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
): void {
  done();
}

export function verifyVIP(
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
): void {
  done();
}

export function validateParamsID(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
): void {
  const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!(id && id.length)) {
    reply.status(StatusCode.BAD_REQUEST).send({ error: "Invalid ID" });
  }
  done();
}

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

export async function asyncVerifyJWT(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  done();
}

export function isAuthenticated(
  request: FastifyRequest<{ Headers: { Authorization: string } }>,
  reply,
  done
) {
  const token = request.headers.authorization;

  try {
    appInstance.jwt.verify(token);
    done();
  } catch (error) {
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Invalid token.",
    });
  }
}
