import { Combination } from "../@types/combination-types";
import {
  batchSaveCombinations,
  findAllCombinations,
} from "../repositories/combination-repository";
import { FieldMask } from "../@types/api-types";

export const createCombinations = async (data: Combination[]) =>
  batchSaveCombinations(data);

export const getAllCombinations = async (
  fieldMask?: FieldMask<Combination>[],
) => {
  const combinations = await findAllCombinations(fieldMask);

  if (combinations == null) {
    throw new Error("Error while getting");
  }

  return combinations;
};

export const getResultOfCombination = async (combination: string[]) =>
  combination.reduce(
    (acc, currentValue) => {
      acc[currentValue] = (acc[currentValue] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
