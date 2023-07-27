import { FastifyReply } from "fastify";
import { HTTP_STATUS_CODES, ONE, TOWER_LEVEL_LIMIT } from "../static/constants";
import { parseCsvFromBuffer } from "../utils/csv-utils";
import { createModel } from "../database/db-model";
import {
  Combination,
  CreateCombination,
  SlotType,
} from "../@types/combination-types";
import { createCombinations } from "./combinations-factory";
import {
  CombinationTowerLevel,
  CreateCombinationTowerLevel,
} from "../@types/combination-tower-level-types";
import { createCombinationTowerLevels } from "./combination-tower-levels-factory";

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
    throw new Error(JSON.stringify(e));
  }
};

const collectCombinationsData = async (data: string[][]) => {
  const combinations: Combination[] = [];
  const combinationTowerLevels: CombinationTowerLevel[] = [];
  const towerLevelRange = Array.from(
    { length: TOWER_LEVEL_LIMIT },
    (_, index) => index + ONE,
  );
  for (const datum of data) {
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

    towerLevelRange.forEach((towerLevel) => {
      const towerLevelCombination = {
        id: `${combination.id}_${towerLevel}`,
        towerLevel,
        combinationId: combination.id,
        amount: Number(datum[towerLevel + 3] || 1),
      };
      combinationTowerLevels.push(
        createModel<CreateCombinationTowerLevel>(towerLevelCombination),
      );
    });

    combinations.push(createModel<CreateCombination>(combination));
  }

  await Promise.all([
    createCombinations(combinations),
    createCombinationTowerLevels(combinationTowerLevels),
  ]);

  return true;
};
