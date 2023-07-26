import {
  findCombinationTowerLevelById,
  saveCombinationTowerLevels,
} from "../repositories/combination-tower-levels-repository";
import { CombinationTowerLevel } from "../@types/combination-tower-level-types";

export const getCombinationTowerLevelByIdOrFail = async (id: string) => {
  const combinationTowerLevel = await findCombinationTowerLevelById(id);
  if (combinationTowerLevel == null) {
    throw new Error("Couldn't find combination tower level");
  }

  return combinationTowerLevel;
};

export const createCombinationTowerLevels = async (
  data: CombinationTowerLevel[],
) => saveCombinationTowerLevels(data);
