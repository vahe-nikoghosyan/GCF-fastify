import {
  CreateRewardRequestBody,
  Reward,
  UpdateRewardRequestBody,
} from "../@types/reward-types";
import {
  findAllRewards,
  modifyRewardById,
  saveReward,
} from "../repositories/reward-repository";
import { FieldMask } from "../@types/api-types";

export const gerAllReward = async (fieldMask?: FieldMask<Reward>[]) =>
  findAllRewards(fieldMask);

export const updateRewardById = async (
  id: string,
  body: UpdateRewardRequestBody,
) => modifyRewardById(id, body);

export const createReward = async (body: CreateRewardRequestBody) =>
  saveReward(body);
