import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbols-repository";
import { ID_SEPARATOR, SPIN_ITERATIONS } from "../static/constants";
import {
  getAllCombinations,
  getResultOfCombination,
} from "./combinations-factory";
import { getAuthorizedUser } from "./users-factory";
import { createMergedKeys } from "../utils/misc-utils";
import { Combination, SlotType } from "../@types/combination-types";
import { getCombinationTowerLevelByIdOrFail } from "./combination-tower-levels-factory";
import { FieldMask } from "../@types/api-types";
import { SpinOutcome, SpinSymbol } from "../@types/spin-types";
import {
  getUserProfileByIdOrFail,
  updateUserProfile,
} from "./user-profile-factory";
import { CombinationTowerLevel } from "../@types/combination-tower-level-types";

const getAllSymbols = async (fieldMask?: FieldMask<SpinSymbol>[]) =>
  findAllSpinSymbols(fieldMask);

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const { id: userId } = await getAuthorizedUser(header);
  const userProfile = await getUserProfileByIdOrFail(userId);

  const results = await getSpinResults();
  const resultOfCombination = await getResultOfCombination(results);
  const { reward } = await getSpinOutcome(
    resultOfCombination,
    userProfile.progress.currentTowerLevel,
  );

  if (Object.keys(reward).length) {
    await updateUserProfile(userId, {
      balance: {
        ...userProfile.balance,
        coin: userProfile.balance.coin + reward.amount,
        spin: userProfile.balance.spin - 1,
      },
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
    return { reward: {} } as Pick<SpinOutcome, "reward">;
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
    } as Pick<SpinOutcome, "reward">,
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
  const rewardActionTypes = ["raid", "attack", "shield", "spin"];
  if (
    selectedSymbolTypes.some((symbolType) => coinsTypes.includes(symbolType))
  ) {
    return "coin";
  }

  if (
    rewardActionTypes.some((rewardAction) => {
      return selectedSymbolTypes.includes(rewardAction);
    })
    // &&
    // selectedSymbolTypes.includes("raid") &&
    // selectedSymbolTypes.length === 1
  ) {
    return selectedSymbolTypes[0];
  }

  // if (
  //   selectedSymbolTypes.includes("attack") &&
  //   selectedSymbolTypes.length === 1
  // ) {
  //   return "attack";
  // }
  //
  // if (
  //   selectedSymbolTypes.includes("shield") &&
  //   selectedSymbolTypes.length === 1
  // ) {
  //   return "shield";
  // }
  //
  // if (
  //   selectedSymbolTypes.includes("spin") &&
  //   selectedSymbolTypes.length === 1
  // ) {
  //   return "spin";
  // }

  return "coin";
};

const getSpinResults = async () => {
  const symbols = await getAllSymbols(["name"]);
  const results = Array.from({ length: SPIN_ITERATIONS }).map(() =>
    getRandomSymbol(symbols),
  );

  return results;
};
