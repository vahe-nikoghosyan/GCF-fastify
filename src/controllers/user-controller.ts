import {
  findUserById,
  findUsersList,
  modifyUserById,
  removeUserById,
  saveUser,
} from "../repositories/users-repository";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCode } from "../utils/constants";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
  UserQueryOptions,
} from "../@types/user-types";
import { ParamsID } from "../@types/api-types";

export const getUsers = async (
  request: FastifyRequest<{ Querystring: UserQueryOptions }>,
  reply: FastifyReply
) => {
  try {
    const { users, size } = await findUsersList();

    reply.status(StatusCode.OK).send(users);
  } catch (error) {
    console.log("error", error);
    reply.status(StatusCode.BAD_REQUEST).send("Error while getting");
  }
};

export const getUserById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const id = request.params.id;
  try {
    const user = await findUserById(id);
    if (!user) {
      return replyUserNotFound(reply);
    }

    reply.status(StatusCode.OK).send(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error retrieving user",
    });
  }
};

export const updateUserById = async (
  request: FastifyRequest<{
    Params: ParamsID;
    Body: UpdateUserRequestBody;
  }>,
  reply: FastifyReply
) => {
  const id = request.params.id;
  const { name, email } = request.body;

  try {
    const user = await findUserById(id);
    if (!user) {
      return replyUserNotFound(reply);
    }
    await modifyUserById(id, { name, email });

    reply.status(StatusCode.OK).send({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error updating user",
    });
  }
};

export const createUser = async (
  request: FastifyRequest<{
    Body: CreateUserRequestBody;
  }>,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body;

  if (!(name && email && password)) {
    return reply.status(StatusCode.BAD_REQUEST).send({
      error: "Invalid request body",
    });
  }

  try {
    const user = await saveUser({ name, email, password });

    reply.status(StatusCode.CREATED).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error creating user",
    });
  }
};

export const deleteUserById = async (
  request: FastifyRequest<{ Params: ParamsID }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params.id;
    const user = await findUserById(id);
    if (!user) {
      return replyUserNotFound(reply);
    }
    await removeUserById(id);

    reply.status(StatusCode.OK).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error deleting user",
    });
  }
};

const replyUserNotFound = (reply: FastifyReply) => {
  console.log("User not found");
  reply.status(StatusCode.NOT_FOUND).send({
    error: "User not found!",
  });
};
