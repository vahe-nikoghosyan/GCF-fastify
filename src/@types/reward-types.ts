import { DatabaseEntity } from "./util-types";

export interface Reward extends DatabaseEntity {
  type: RewardType;
  actionType: RewardActionType;
}

export type RewardType<T = "coin" | "spin" | "attack" | "raid"> = T;
export type RewardActionType<T = "action" | "currency"> = T;

export type CreateRewardRequestBody = Omit<Reward, keyof DatabaseEntity>;
export type UpdateRewardRequestBody = Partial<
  Omit<Reward, keyof DatabaseEntity>
>;
