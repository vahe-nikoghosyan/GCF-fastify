import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbols";
import { ID_SEPARATOR, SPIN_ITERATIONS } from "../utils/constants";
import {
  getAllCombinations,
  getResultOfCombination,
} from "./combinations-factory";
import { getUserByDeviceId } from "./users-factory";
import { createMergedKeys } from "../utils/misc-utils";
import { Combination, SlotType } from "../@types/combination-types";
import { getCombinationTowerLevelByIdOrFail } from "./combination-tower-levels-factory";
import { FieldMask } from "../@types/api-types";
import { SpinSymbol } from "../@types/spin-types";

const getAllSymbols = async (fieldMask?: FieldMask<SpinSymbol>[]) =>
  findAllSpinSymbols(fieldMask);

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const currentUser = await getUserByDeviceId(header.deviceId);

  if (currentUser == null) {
    throw new Error("Error while getting user");
  }

  const results = await getSpinResults();
  const resultOfCombination = await getResultOfCombination(results);
  const { reward } = await getSpinOutcome(
    resultOfCombination,
    currentUser.progress.currentTowerLevel,
  );

  return sendWSMessage(
    connection,
    {
      action: header.action,
      requestId: header.requestId,
      type: "CONFIRM",
    },
    { results, reward },
  );
};

export const getSpinOutcome = async (
  combinationResult: Record<string, number>,
  currentTowerLevel: number,
) => {
  const combinations = await getAllCombinations([
    "symbolType",
    "combination",
    "combinationType",
  ]);

  const combinationsMap = createMergedKeys(combinations, [
    "symbolType",
    "combination",
  ]);
  const selectedSymbolTypes: SlotType[] = [];

  const selectedCombinations = Object.entries(combinationResult).reduce(
    (acc, [key, value]) => {
      const combination = combinationsMap[`${key}${value}`];
      if (combination == null) {
        return acc;
      }
      selectedSymbolTypes.push(combination.symbolType);
      acc.push(combination);

      return acc;
    },
    [] as Combination[],
  );

  if (!selectedSymbolTypes.length) {
    return { reward: {} };
  }

  const selectedRewards = await Promise.all(
    selectedCombinations.map(({ id: combinationId }) =>
      getCombinationTowerLevelByIdOrFail(
        `${combinationId}${ID_SEPARATOR}${currentTowerLevel}`,
      ),
    ),
  );

  const [currentCombination] = selectedCombinations;

  return selectedRewards.reduce(
    (acc, reward) => ({
      ...acc,
      amount:
        currentCombination.combinationType === "currency"
          ? (acc.reward.amount += reward.amount)
          : 1,
    }),
    {
      reward: {
        id: getOutcomeRewardId(selectedSymbolTypes),
        amount: currentCombination.combinationType === "action" ? 1 : 0,
        type: currentCombination.combinationType,
      },
    },
  );
};

const getRandomSymbol = (symbols: SpinSymbol[]) => {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex].name;
};

const getOutcomeRewardId = (selectedSymbolTypes: string[]) => {
  const coinsType = ["coin", "jackpot"];
  if (
    selectedSymbolTypes.some((symbolType) => coinsType.includes(symbolType))
  ) {
    return "coin";
  }

  if (
    selectedSymbolTypes.includes("raid") &&
    selectedSymbolTypes.length === 1
  ) {
    return "raid";
  }

  if (
    selectedSymbolTypes.includes("attack") &&
    selectedSymbolTypes.length === 1
  ) {
    return "attack";
  }

  if (
    selectedSymbolTypes.includes("shield") &&
    selectedSymbolTypes.length === 1
  ) {
    return "shield";
  }

  if (
    selectedSymbolTypes.includes("spin") &&
    selectedSymbolTypes.length === 1
  ) {
    return "spin";
  }

  return "coin";
};

const getSpinResults = async () => {
  const symbols = await getAllSymbols(["name"]);
  const results: string[] = [];
  for (const _ of Array.from({ length: SPIN_ITERATIONS })) {
    results.push(getRandomSymbol(symbols));
  }
  return results;
};
