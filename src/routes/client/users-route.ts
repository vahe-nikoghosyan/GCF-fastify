import { FastifyInstance } from "fastify";
import { deleteUserSwaggerOptions } from "../swagger/users-swagger";
import { TAGS } from "../../utils/constants";
import { validateParamsID } from "../../decorators";

// TODO: for future implementation
export default async (app: FastifyInstance) => {
  app.route({
    method: "DELETE",
    url: "/:id",
    schema: deleteUserSwaggerOptions([TAGS.ClientUser]),
    preHandler: [validateParamsID],
    handler: () => {},
  });
};
