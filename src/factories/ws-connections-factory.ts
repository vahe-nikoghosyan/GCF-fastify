import {
  findWSConnectionById,
  modifyWSConnectionById,
  removeWSConnectionById,
  saveWSConnectionWithSpecificId,
} from "../repositories/ws-connection-repository";
import { UpdateWSConnectionRequestBody } from "../@types/ws-connection";

export const getWSConnectionById = async (id: string) =>
  findWSConnectionById(id);

export const createWSConnection = async (id: string) =>
  saveWSConnectionWithSpecificId({ id });

export const updateWSConnection = async (
  id: string,
  body: UpdateWSConnectionRequestBody,
) => modifyWSConnectionById(id, body);

export const deleteWSConnectionById = async (id: string) =>
  removeWSConnectionById(id);
