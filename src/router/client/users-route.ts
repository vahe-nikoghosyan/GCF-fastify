import { FastifyInstance } from "fastify";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUserById,
} from "../../controller/userController";
import { Tags } from "../../types/enum";
import {
  createUserSwaggerOptions,
  deleteUserSwaggerOptions,
  getUserByIdSwaggerOptions,
  getUsersSwaggerOptions,
  updateUserSwaggerOptions,
} from "../swagger/users-swagger";
import {
  CreateUserRequestBody,
  UpdateUserRequestBody,
  UserHeaders,
  UserParams,
  UserQueryOptions,
  UserQuerystring,
} from "../../types/user-types";

export async function usersRoute(app: FastifyInstance) {
  app
    .addHook("preHandler", app.auth([app.verifyLevel, app.verifyVIP]))
    .addHook("preValidation", app.validatePaginationRequestQuery)
    .get<{
      Querystring: UserQueryOptions;
    }>("/", getUsersSwaggerOptions([Tags.CLIENT_USER]), getUsers);

  // app.route({
  //   method: "GET",
  //   url: "/all",
  //   preHandler: app.auth(
  //     [[app.verifyUserPassword, app.verifyLevel], app.verifyVIP],
  //     {
  //       relation: "or",
  //     }
  //   ),
  //   handler: (req, reply) => {
  //     req.log.info("Auth route");
  //     reply.send({ hello: "world" });
  //   },
  // });

  app.addHook("preValidation", app.validateParamsID).get<{
    Params: UserParams;
    Querystring: UserQuerystring;
    Headers: UserHeaders;
  }>("/:id", getUserByIdSwaggerOptions([Tags.CLIENT_USER]), getUserById);

  app.addHook("preValidation", app.validateParamsID).put<{
    Params: UserParams;
    Querystring: UserQuerystring;
    Headers: UserHeaders;
    Body: UpdateUserRequestBody;
  }>("/:id", updateUserSwaggerOptions([Tags.CLIENT_USER]), updateUserById);

  app.post<{
    Headers: UserHeaders;
    Body: CreateUserRequestBody;
  }>("/", createUserSwaggerOptions([Tags.CLIENT_USER]), createUser);

  app.addHook("preValidation", app.validateParamsID).delete<{
    Params: UserParams;
  }>("/:id", deleteUserSwaggerOptions([Tags.CLIENT_USER]), deleteUser);
}
