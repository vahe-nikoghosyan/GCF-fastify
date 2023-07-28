import { DatabaseEntity, EntityDates } from "./util-types";

export interface Combination extends DatabaseEntity {
  name: string;
  importIndex: number;
  symbolType: SlotType;
  combination: number;
  combinationType: ActionType;
}

export type CreateCombination = Omit<Combination, keyof EntityDates>;
export type ActionType = "currency" | "action";
export type SlotType =
  | "special"
  | "coin"
  | "raid"
  | "spin"
  | "shield"
  | "jackpot"
  | "attack"
  | "attack block";
