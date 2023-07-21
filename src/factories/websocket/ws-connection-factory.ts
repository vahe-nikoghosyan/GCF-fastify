import {
  findWsConnectionById,
  modifyWsConnectionById,
  removeWsConnectionById,
  saveWsConnectionWithSpecificId,
} from "../../repositories/ws-connection-repository";
import {
  UpdateWsConnectionRequestBody,
  WsConnection,
} from "../../@types/ws-connection";
import { FastifyReply, FastifyRequest } from "fastify";
import { ParamsID } from "../../@types/api-types";
import { HTTP_STATUS_CODES } from "../../utils/constants";

export const createWsConnection = async (id: string) => {
  try {
    return await saveWsConnectionWithSpecificId({ id } as WsConnection);
  } catch (error) {
    console.error("Error creating ws collection:", error);
    throw new Error("Error while creating");
  }
};

export const updateWsConnection = async (
  id: string,
  body: UpdateWsConnectionRequestBody,
) => {
  try {
    return await modifyWsConnectionById(id, body);
  } catch (error) {
    console.error("Error updating ws collection:", error);
    throw new Error("Error while updating");
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
