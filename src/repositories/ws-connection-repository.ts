import firestore from "../database";
import {
  UpdateWSConnectionRequestBody,
  WSConnection,
} from "../@types/ws-connection";
import logger from "../logger";

const WS_CONNECTION_NAME = "ws_connections";
const collectionRef = firestore.collection(WS_CONNECTION_NAME);

const log = logger.child({ from: "WS connection Repository" });

export const findWSConnectionList = async () => {
  const snapshot = await collectionRef.get();

  const wsConnections = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return {
    wsConnections,
    size: snapshot.size,
  };
};

export const findWSConnectionById = async (id: string) => {
  const wsConnection = await collectionRef.doc(id).get();
  if (!wsConnection.exists) {
    return null;
  }

  return {
    id: wsConnection.id,
    ...wsConnection.data(),
  };
};

export const modifyWSConnectionById = async (
  id: string,
  body: UpdateWSConnectionRequestBody,
) => collectionRef.doc(id).update(body);

export const removeWSConnectionById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveWSConnectionWithSpecificId = async ({ id }: WSConnection) => {
  const wsConnection = await collectionRef.doc(id).set({});
  log.info("created ws connection", wsConnection);
  return { id };
};
