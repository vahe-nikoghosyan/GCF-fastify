import { SocketStream } from "@fastify/websocket";
import { WSRequestHeader } from "../@types/ws-types";
import { sendWSMessage } from "./ws-factory";

export const spin = async (
  connection: SocketStream,
  header: WSRequestHeader,
  body: any,
) => {
  const results = [];
  for (let i = 0; i < 3; i++) {
    results.push(getRandomSymbol(body.betX));
  }
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

function getRandomSymbol(
  betX: number,
  dynamicSymbol?: { name: string; percent: number },
) {
  const symbols = [
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
  if (dynamicSymbol) {
    symbols.push(dynamicSymbol);
  }

  const totalPercent = symbols.reduce((acc, cur) => {
    acc += cur.percent;
    return acc;
  }, 0);

  let gago = null;
  let randomPercent = Math.floor(Math.random() * totalPercent);
  symbols.some((symbol) => {
    randomPercent -= symbol.percent;
    if (randomPercent <= 0) {
      gago = symbol.name;
      return true;
    }
    return false;
  });
  // const randomIndex = Math.floor(Math.random() * symbols.length);
  return gago;
}
