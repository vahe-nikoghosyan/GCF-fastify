import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";
import { findAllSpinSymbols } from "../repositories/spin-symbols";
import { SPIN_ITERATIONS } from "../utils/constants";

const getAllSymbols = async () => {
  const symbols = await findAllSpinSymbols();

  return symbols;
};

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
) => {
  const results = [];
  for (const i of Array.from({ length: SPIN_ITERATIONS })) {
    results.push(await getRandomSymbol());
  }
  // TODO: get coin of combination
  return sendWSMessage(
    connection,
    {
      action: header.action,
      requestId: header.requestId,
      type: "CONFIRM",
    },
    { results, coin: 500, point: 5 },
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
