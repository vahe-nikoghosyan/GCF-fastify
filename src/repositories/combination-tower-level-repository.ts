import firestore from "../database";
import { CombinationTowerLevel } from "../@types/combination-tower-level-types";

export const COLLECTION_NAME = "combination_tower_levels";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findCombinationTowerLevelById = async (id: string) => {
  const combinationTowerLevel = await collectionRef.doc(id).get();
  if (!combinationTowerLevel.exists) {
    return null;
  }

  return {
    id: combinationTowerLevel.id,
    ...combinationTowerLevel.data(),
  } as CombinationTowerLevel;
};

export const saveCombinationTowerLevels = async (
  data: CombinationTowerLevel[],
) => {
  const batch = firestore.batch();

  data.forEach(({ id, ...data }) => {
    const collection = collectionRef.doc(id);
    batch.set(collection, data);
  });

  await batch.commit();

  return data;
};
