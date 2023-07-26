import { Combination } from "../@types/combination-types";
import { saveCombinations } from "../repositories/combination-repository";

export const createCombinations = async (data: Combination[]) => {
  return saveCombinations(data);
};
export const getResultOfCombination = async (combination: string[]) => {
  const parsedCombination = combination;
  // TODO: get from DB
};