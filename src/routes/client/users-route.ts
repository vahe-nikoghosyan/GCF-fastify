import { FastifyInstance } from "fastify";
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../../factories/users-factory";
import {
  createUserSwaggerOptions,
  deleteUserSwaggerOptions,
  getUserByIdSwaggerOptions,
  getUsersSwaggerOptions,
  updateUserSwaggerOptions,
} from "../swagger/users-swagger";
import { TAGS } from "../../utils/constants";
import {
  validatePaginationRequestQuery,
  validateParamsID,
  verifyLevel,
} from "../../decorators";

export default async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/",
    schema: getUsersSwaggerOptions([TAGS.ClientUser]),
    preValidation: validatePaginationRequestQuery,
    handler: getUsers,
  });

  app.route({
    method: "GET",
    url: "/:id",
    schema: getUserByIdSwaggerOptions([TAGS.ClientUser]),
    preHandler: validateParamsID,
    handler: getUserById,
  });

  app.route({
    method: "PUT",
    url: "/:id",
    schema: updateUserSwaggerOptions([TAGS.ClientUser]),
    preHandler: validateParamsID,
    handler: updateUserById,
  });

  app.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteUserSwaggerOptions([TAGS.ClientUser]),
    preHandler: [validateParamsID, verifyLevel],
    handler: deleteUserById,
  });

  app.route({
    method: "POST",
    url: "/",
    schema: createUserSwaggerOptions([TAGS.ClientUser]),
    // preValidation: validateUserCreateRequest,
    handler: createUser,
  });
};
