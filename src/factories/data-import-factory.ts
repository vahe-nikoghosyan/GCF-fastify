import { FastifyReply } from "fastify";
import {
  HTTP_STATUS_CODES,
  ID_SEPARATOR,
  TOWER_LEVEL_LIMIT,
} from "../static/constants";
import { parseCsvFromBuffer } from "../utils/csv-utils";
import { createModel } from "../database/db-model";
import { Combination, SlotType } from "../@types/combination-types";
import { createCombinations } from "./combination-factory";
import {
  CombinationTowerLevel,
  CreateCombinationTowerLevel,
} from "../@types/combination-tower-level-types";
import { createCombinationTowerLevels } from "./combination-tower-level-factory";

export const importCombinationsCsvFile = async (
  request: any,
  reply: FastifyReply,
) => {
  const data = await request.file();
  const buffer = await data.toBuffer();

  try {
    const parsed = (await parseCsvFromBuffer(buffer, {
      fromLine: 3,
      autoParse: true,
      skipEmptyLines: true,
    })) as string[][];

    await collectCombinationsData(parsed);

    reply.status(HTTP_STATUS_CODES.OK).send("File uploaded successfully!");
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
};

const collectCombinationsData = async (data: string[][]) => {
  const towerLevelRange = Array.from({ length: TOWER_LEVEL_LIMIT });

  const { combinations, combinationTowerLevels } = data.reduce(
    (acc, datum) => {
      const combination = {
        id: datum[0],
        name: datum[1].trim(),
        symbolType: datum[2].toLowerCase() as SlotType,
        combination: Number(datum[3]),
      } as Combination;

      switch (combination.symbolType) {
        case "attack":
        case "spin":
        case "attack block":
        case "raid":
        case "shield":
          combination.combinationType = "action";
          break;
        default:
          combination.combinationType = "currency";
          break;
      }

      const combinationTowerLevel = towerLevelRange
        .map((_, index) => {
          const towerLevel = index + 1;
          const towerLevelCombination = {
            id: `${combination.id}${ID_SEPARATOR}${towerLevel}`,
            towerLevel,
            combinationId: combination.id,
            amount: Number(datum[towerLevel + 3] || 1),
          };
          return createModel<CreateCombinationTowerLevel>(
            towerLevelCombination,
          );
        })
        .flat();

      return {
        combinations: [...acc.combinations, combination],
        combinationTowerLevels: [
          ...acc.combinationTowerLevels,
          ...combinationTowerLevel,
        ],
      };
    },
    {
      combinations: [],
      combinationTowerLevels: [],
    } as {
      combinations: Combination[];
      combinationTowerLevels: CombinationTowerLevel[];
    },
  );

  await Promise.all([
    createCombinations(combinations),
    createCombinationTowerLevels(combinationTowerLevels),
  ]);

  return true;
};
