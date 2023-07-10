import { FastifyInstance } from "fastify";
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../../controllers/user-controller";
import {
  createUserSwaggerOptions,
  deleteUserSwaggerOptions,
  getUserByIdSwaggerOptions,
  getUsersSwaggerOptions,
  updateUserSwaggerOptions,
} from "../swagger/users-swagger";
import { StatusCode, Tags } from "../../utils/constants";
import {
  validateParamsID,
  verifyLevel,
  // verifyUserPassword,
} from "../../decorators";
import { UserQueryOptions } from "../../@types/user-types";

export default async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/",
    schema: getUsersSwaggerOptions([Tags.CLIENT_USER]),
    handler: getUsers,
  });

  app.route({
    method: "GET",
    url: "/:id",
    schema: getUserByIdSwaggerOptions([Tags.CLIENT_USER]),
    preHandler: validateParamsID,
    handler: getUserById,
  });

  app.route({
    method: "PUT",
    url: "/:id",
    schema: updateUserSwaggerOptions([Tags.CLIENT_USER]),
    preHandler: validateParamsID,
    handler: updateUserById,
  });

  app.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteUserSwaggerOptions([Tags.CLIENT_USER]),
    preHandler: [validateParamsID, verifyLevel],
    handler: deleteUserById,
  });

  app.route({
    method: "POST",
    url: "/",
    schema: createUserSwaggerOptions([Tags.CLIENT_USER]),
    // preValidation: validateUserCreateRequest,
    handler: createUser,
  });
};
