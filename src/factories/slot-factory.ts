import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbol-repository";
import { ID_SEPARATOR, SPIN_ITERATIONS } from "../static/constants";
import {
  getAllCombinations,
  getResultOfCombination,
} from "./combination-factory";
import { getAuthorizedUser, updateUserById } from "./user-factory";
import { createMergedKeys } from "../utils/misc-utils";
import { Combination, SlotType } from "../@types/combination-types";
import { getCombinationTowerLevelByIdOrFail } from "./combination-tower-level-factory";
import { FieldMask } from "../@types/api-types";
import { SpinOutcome, SpinSymbol } from "../@types/spin-types";
import { SpinOutcomeReward, SpinSymbol } from "../@types/spin-types";
import {
  getUserProfileByIdOrFail,
  updateUserProfile,
} from "./user-profiles-factory";
import { CombinationTowerLevel } from "../@types/combination-tower-level-types";

const getAllSymbols = async (fieldMask?: FieldMask<SpinSymbol>[]) =>
  findAllSpinSymbols(fieldMask);

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const { id: userId, ...user } = await getAuthorizedUser(header);

  const results = await getSpinResults();
  const resultOfCombination = await getResultOfCombination(results);
  const { reward } = await getSpinOutcome(
    resultOfCombination,
    user.currentTowerLevel,
  );

  if ("id" in reward) {
    await updateUserById(userId, {
      ...user,
      spin: user.spin - 1,
      ...(reward.type === "currency" && {
        coin: user.coin + reward.amount,
      }),
    });
  }

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
      return [...acc, combination];
    },
    [] as Combination[],
  );

  if (!selectedSymbolTypes.length) {
    return { reward: {} } as { reward: SpinOutcomeReward };
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
        currentCombination.combinationType === "currency" ||
        currentCombination.symbolType === "spin"
          ? (acc.reward.amount += reward.amount)
          : 1,
    }),
    {
      reward: {
        id: getOutcomeRewardId(selectedSymbolTypes),
        amount: 0,
        type: currentCombination.combinationType,
      },
    } as { reward: SpinOutcomeReward },
  );
};

const getSelectedRewardAmount = (
  currentCombination: Combination,
  combinationReward: CombinationTowerLevel,
  previousAmount: number,
) => {
  if (
    currentCombination.combinationType === "currency" ||
    currentCombination.symbolType === "spin"
  ) {
    return previousAmount + combinationReward.amount;
  }

  if (currentCombination.combinationType === "action") {
    return 1;
  }

  return 0;
};

const getRandomSymbol = (symbols: SpinSymbol[]) => {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex].name;
};

const getOutcomeRewardId = (selectedSymbolTypes: string[]) => {
  const coinsTypes = ["coin", "jackpot"];

  return selectedSymbolTypes.some((symbolType) =>
    coinsTypes.includes(symbolType),
  )
    ? "coin"
    : selectedSymbolTypes[0];
};

const getSpinResults = async () => {
  const symbols = await getAllSymbols(["name"]);
  return Array.from({ length: SPIN_ITERATIONS }).map(() =>
    getRandomSymbol(symbols),
  );
};
