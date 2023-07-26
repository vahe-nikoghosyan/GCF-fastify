import firestore from "../database";
import { Combination } from "../@types/combination-types";

export const COLLECTION_NAME = "combinations";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const saveCombinations = async (data: Combination[]) => {
  const batch = firestore.batch();

  data.forEach(({ id, ...data }) => {
    const collection = collectionRef.doc(id);
    batch.set(collection, data);
  });

  await batch.commit();

  return data;
};
