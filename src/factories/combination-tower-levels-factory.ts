import { saveCombinationTowerLevels } from "../repositories/combination-tower-levels-repository";
import { CombinationTowerLevel } from "../@types/combination-tower-level-types";

export const createCombinationTowerLevels = async (
  data: CombinationTowerLevel[],
) => saveCombinationTowerLevels(data);
