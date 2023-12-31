import { FastifyInstance } from "fastify";
import { importCombinationsCsvFile } from "../../factories/data-import-factory";

export default async (app: FastifyInstance) => {
  app.post("/combination", importCombinationsCsvFile);
};
