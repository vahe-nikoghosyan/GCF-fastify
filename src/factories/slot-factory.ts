import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbols";
import { SPIN_ITERATIONS } from "../utils/constants";
import { SpinOutcome } from "../@types/spin-types";
import {
  getAllCombinations,
  getResultOfCombination,
} from "./combinations-factory";
import { getUserByDeviceId } from "./users-factory";

export const getAllSymbols = async () => {
  const symbols = await findAllSpinSymbols();

  return (
    symbols || [
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
        name: "purse",
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
    ]
  );
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
  console.log("combination");
  const resultOfCombination = await getResultOfCombination(results);
  const { reward } = await getSpinOutcome(
    resultOfCombination,
    currentUser.progress.currentTowerLevel,
  );
  console.log("spinOutCome", reward);

  // TODO: get coin of combination
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
  const dbComb = await getAllCombinations();
  console.log("dbComb", dbComb);
  const combinations = [
    {
      type: "attack",
      towerLevel: 1,
      combination: 3,
      amount: 1,
      combinationType: "action",
    },
    {
      type: "raid",
      towerLevel: 1,
      combination: 3,
      amount: 1,
      combinationType: "action",
    },

    {
      type: "coin",
      towerLevel: 1,
      combination: 1,
      amount: 1000,
      combinationType: "currency",
    },

    {
      type: "coin",
      towerLevel: 1,
      combination: 2,
      amount: 2000,
      combinationType: "currency",
    },

    {
      type: "purse",
      towerLevel: 1,
      combination: 2,
      amount: 12000,
      combinationType: "currency",
    },

    {
      type: "purse",
      towerLevel: 1,
      combination: 3,
      amount: 22000,
      combinationType: "currency",
    },

    {
      type: "shield",
      towerLevel: 1,
      combination: 3,
      amount: 1,
      combinationType: "action",
    },

    {
      type: "spin",
      towerLevel: 1,
      combination: 3,
      amount: 1,
      combinationType: "action",
    },
  ]; // db get combinations

  const amount = 1;
  return combinations.reduce(
    (acc, next) => {
      let amount = 0;
      const currentCombination = Object.entries(combinationResult).reduce(
        (acc, [key, value]) => {
          const isCombinationFound = next.type == key;
          if (isCombinationFound && value === SPIN_ITERATIONS) {
            acc["type"] = next.combinationType;
            acc["amount"] = 1;

            return acc;
          }

          if (isCombinationFound && next.combination === value) {
            amount += next.amount;
            acc["type"] = "currency";
            acc["amount"] = amount;
          }

          return acc;
        },
        {} as any,
      );
      console.log("currentCombination", currentCombination);

      if (Object.keys(currentCombination).length) {
        acc.reward = currentCombination;
      }
      return acc;

      return acc;
    },
    { reward: {} },
  );
};

const getRandomSymbol = async () => {
  const symbols = (await getAllSymbols()) || [
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
      name: "purse",
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
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex].name;
};
