import firestore from "../database";
import { Combination } from "../@types/combination-types";
import { SpinSymbol } from "../@types/spin-types";

export const COLLECTION_NAME = "combinations";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findAllCombinations = async (fieldMask: [] = []) => {
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  if (fieldMask.length) {
    query = query.select(...fieldMask);
  }

  const combinationsSnapshot = await query.get();

  if (combinationsSnapshot.empty) {
    return [];
  }

  return combinationsSnapshot.docs.map((combination) => ({
    id: combination.id,
    ...combination.data(),
  })) as SpinSymbol[];
};

export const batchSaveCombinations = async (data: Combination[]) => {
  const batch = firestore.batch();

  data.forEach(({ id, ...data }) => {
    const collection = collectionRef.doc(id);
    batch.set(collection, data);
  });

  await batch.commit();

  return data;
};
