import {
  findWsConnectionById,
  removeWsConnectionById,
  saveWsConnectionWithSpecificId,
} from "../repositories/ws-connection-repository";
import {
  CreateWsConnectionRequestBody,
  WsConnection,
} from "../@types/ws-connection";
import { FastifyReply, FastifyRequest } from "fastify";
import { ParamsID } from "../@types/api-types";
import { HTTP_STATUS_CODES } from "../utils/constants";

export const createWsConnection = async (
  id: string,
  { userId }: CreateWsConnectionRequestBody,
) => {
  if (!userId) {
    throw new Error("Not acceptable");
  }

  try {
    return await saveWsConnectionWithSpecificId({ id, userId } as WsConnection);
  } catch (error) {
    console.error("Error creating ws collection:", error);
    throw new Error("Error while creating");
  }
};

export const deleteWsById = async (
  request: FastifyRequest<{ Params: ParamsID }>,
  reply: FastifyReply,
) => {
  try {
    const id = request.params.id;
    const wsConnection = await findWsConnectionById(id);
    if (!wsConnection) {
      return new Error("Couldn't find the document!");
    }
    await removeWsConnectionById(id);

    reply.status(HTTP_STATUS_CODES.OK).send({
      message: "Ws connection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ws connection:", error);
    reply.status(HTTP_STATUS_CODES.InternalServerError).send({
      error: "Error deleting ws connection",
    });
  }
};
