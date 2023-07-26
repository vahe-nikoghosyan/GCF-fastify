import firestore from "../database";
import { createModel } from "../database/db-model";
import { CreateSpinSymbolRequest, SpinSymbol } from "../@types/spin-types";

export const COLLECTION_NAME = "spin-symbols";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findAllSpinSymbols = async () => {
  const spinSymbolsSnapshot = await collectionRef.get();

  if (spinSymbolsSnapshot.empty) {
    return null;
  }

  return spinSymbolsSnapshot.docs.map((spinSymbolDoc) => ({
    id: spinSymbolDoc.id,
    ...spinSymbolDoc.data(),
  })) as SpinSymbol[];
};

export const saveSpinSymbol = async (body: CreateSpinSymbolRequest) => {
  const spinSymbolModel = createModel(body);
  const spinSymbol = await collectionRef.add(spinSymbolModel);

  return {
    id: spinSymbol.id,
    ...spinSymbolModel,
  } as SpinSymbol;
};
