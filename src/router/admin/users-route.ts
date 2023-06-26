import { FastifyInstance } from "fastify";

import { getUserById } from "../../controller/userController";
import { Tags } from "../../types/enum";
import { getUserByIdSwaggerOptions } from "../swagger/users-swagger";

interface UserParams {
  id: string;
}

interface UserQuerystring {
  username: string;
  password: string;
}

interface UserHeaders {
  "h-Custom": string;
}

export async function usersRoute(app: FastifyInstance) {
  app.get<{
    Params: UserParams;
    Querystring: UserQuerystring;
    Headers: UserHeaders;
  }>("/:id", getUserByIdSwaggerOptions([Tags.ADMIN_USER]), getUserById);

  app.post<{
    Params: UserParams;
    Querystring: UserQuerystring;
    Headers: UserHeaders;
  }>("/login", (request, reply) => {
    const token = app.jwt.sign({ userId: "userID" });

    reply.send({ token });
  });

  app.get<{
    Params: UserParams;
    Querystring: UserQuerystring;
    Headers: UserHeaders;
  }>("/protected", { preValidation: app.isAuthenticated }, (request, reply) => {
    const decoded = app.jwt.verify(request.headers.authorization);
    reply.send({ message: "Protected route", user: decoded });
  });
}
