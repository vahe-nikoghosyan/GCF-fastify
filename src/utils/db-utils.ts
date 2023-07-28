import { DocumentData, DocumentSnapshot } from "@google-cloud/firestore";

export const createModel = <T>(model: T, date = Date.now()) => ({
  createdAt: date,
  updatedAt: date,
  ...model,
});

export const getDocumentData = async <T>(
  snapshot: DocumentSnapshot<DocumentData>,
) => (snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as T) : null);
