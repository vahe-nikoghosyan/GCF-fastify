import firestore from "../database";
import { CreateSpinSymbolRequest, SpinSymbol } from "../@types/spin-types";
import { FieldMask } from "../@types/api-types";
import { createModel } from "../utils/db-utils";

export const COLLECTION_NAME = "spin_symbols";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findAllSpinSymbols = async (
  fieldMask?: FieldMask<SpinSymbol>[],
) => {
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  if (fieldMask?.length) {
    query = query.select(...fieldMask);
  }

  const spinSymbolsSnapshot = await query.get();

  if (spinSymbolsSnapshot.empty) {
    return [];
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
