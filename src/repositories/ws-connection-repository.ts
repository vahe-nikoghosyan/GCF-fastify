import firestore from "../database";
import {
  UpdateWsConnectionRequestBody,
  WsConnection,
} from "../@types/ws-connection";

const WS_CONNECTION_NAME = "ws_connections";
const collectionRef = firestore.collection(WS_CONNECTION_NAME);

export const findWsConnectionList = async (requestQuery?: any) => {
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  if (requestQuery && Object.keys(requestQuery).length) {
    const { limit, offset, page, ...rest } = requestQuery;

    Object.entries(rest).forEach(([key, value]) => {
      query = query.where(key, "==", value);
    });

    if (limit != null) {
      query = query.limit(Number(limit));
    }
  }

  const snapshot = await (query || collectionRef).get();

  const WsConnections = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return {
    WsConnections,
    size: snapshot.size,
  };
};

export const findWsConnectionById = async (id: string) => {
  const ws = await collectionRef.doc(id).get();
  if (!ws.exists) {
    return null;
  }

  return {
    id: ws.id,
    ...ws.data(),
  };
};

export const modifyWsConnectionById = async (
  id: string,
  body: UpdateWsConnectionRequestBody,
) => collectionRef.doc(id).update(body);

export const removeWsConnectionById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveWsConnectionWithSpecificId = async ({
  id,
  userId,
}: WsConnection) => {
  const wsConnection = await collectionRef.doc(id).set({ userId });
  console.log("created ws collection", wsConnection);
  return { id, userId };
};
