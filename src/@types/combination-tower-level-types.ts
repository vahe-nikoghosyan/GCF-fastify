import { DatabaseEntity, EntityDates } from "./util-types";

export interface CombinationTowerLevel extends DatabaseEntity {
  towerLevel: number;
  combinationId: string;
  amount: number;
}

export type CreateCombinationTowerLevel = Omit<
  CombinationTowerLevel,
  keyof EntityDates
>;
