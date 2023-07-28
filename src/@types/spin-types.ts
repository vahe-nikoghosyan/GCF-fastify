import { DatabaseEntity } from "./util-types";
import { RewardActionType, RewardType } from "./reward-types";

export interface SpinSymbol extends DatabaseEntity {
  name: string;
}

export interface SpinOutcome {
  result: string[];
  reward: SpinOutcomeReward;
}

export interface SpinOutcomeReward {
  id: RewardType;
  type: RewardActionType;
  amount: number;
}

export type CreateSpinSymbolRequest = Omit<SpinSymbol, keyof DatabaseEntity>;
