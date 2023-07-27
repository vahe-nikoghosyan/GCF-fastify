import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbols";
import { SPIN_ITERATIONS } from "../utils/constants";
import {
  getAllCombinations,
  getResultOfCombination,
} from "./combinations-factory";
import { getUserByDeviceId } from "./users-factory";
import { createMergedKeys } from "../utils/misc-utils";
import { Combination, SlotType } from "../@types/combination-types";
import { getCombinationTowerLevelByIdOrFail } from "./combination-tower-levels-factory";

const getAllSymbols = async () => {
  const symbols = await findAllSpinSymbols();

  return symbols.length
    ? symbols
    : [
        {
          name: "special",
          percent: 10,
        },
        {
          name: "attack",
          percent: 10,
        },
        {
          name: "coin",
          percent: 29,
        },
        {
          name: "shield",
          percent: 15,
        },
        {
          name: "jackpot",
          percent: 9,
        },
        {
          name: "spin",
          percent: 57,
        },
        {
          name: "raid",
          percent: 100,
        },
      ];
};

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const currentUser = await getUserByDeviceId(header.deviceId);

  if (currentUser == null) {
    throw new Error("Error while getting user");
  }

  const results = [];
  for (const i of Array.from({ length: SPIN_ITERATIONS })) {
    results.push(await getRandomSymbol());
  }
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
  const combinations = await getAllCombinations();
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
    selectedCombinations.map(({ id }) =>
      getCombinationTowerLevelByIdOrFail(`${id}_${currentTowerLevel}`),
    ),
  );

  return selectedRewards.reduce(
    (acc, reward) => {
      return { ...acc, amount: (acc.reward.amount += reward.amount) };
    },
    {
      reward: {
        ids: selectedSymbolTypes,
        amount: 0,
        type: selectedCombinations[0].combinationType,
      },
    },
  );
};

const getRandomSymbol = async () => {
  const symbols = await getAllSymbols();
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex].name;
};
