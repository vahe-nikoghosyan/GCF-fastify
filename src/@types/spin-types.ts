import { DatabaseEntity } from "./util-types";

export interface SpinSymbol extends DatabaseEntity {
  name: string;
}

export interface SpinOutcome {
  result: string[];
  reward: SpinOutcomeReward;
}

export interface SpinOutcomeReward {
  id: RewardId;
  type: RewardType;
  amount: number;
}

export type RewardId = "coin" | "spin" | "attack" | "raid";
export type RewardType = "action" | "currency";
export type CreateSpinSymbolRequest = Omit<SpinSymbol, keyof DatabaseEntity>;
