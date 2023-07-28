import firestore from "../database";
import {
  CreateRewardRequestBody,
  Reward,
  UpdateRewardRequestBody,
} from "../@types/reward-types";
import { FieldMask } from "../@types/api-types";
import { SpinSymbol } from "../@types/spin-types";
import { createModel } from "../utils/db-utils";

export const COLLECTION_NAME = "rewards";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findAllRewards = async (fieldMask?: FieldMask<Reward>[]) => {
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  if (fieldMask?.length) {
    query = query.select(...fieldMask);
  }

  const rewardsSnapshot = await query.get();

  if (rewardsSnapshot.empty) {
    return [];
  }

  return rewardsSnapshot.docs.map((rewardDoc) => ({
    id: rewardDoc.id,
    ...rewardDoc.data(),
  })) as SpinSymbol[];
};

export const findRewardById = async (id: string) => {
  const reward = await collectionRef.doc(id).get();

  if (!reward.exists) {
    return null;
  }

  return {
    id: reward.id,
    ...reward.data(),
  } as Reward;
};

export const modifyRewardById = async (
  id: string,
  body: UpdateRewardRequestBody,
) => collectionRef.doc(id).update(body);

export const removeUserById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveReward = async (body: CreateRewardRequestBody) => {
  const rewardModel = createModel(body);
  const reward = await collectionRef.add(rewardModel);

  return {
    id: reward.id,
    ...rewardModel,
  } as Reward;
};
