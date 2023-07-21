import firestore from "../database";
import { UpdateUserRequestBody } from "../@types/user-types";

export const COLLECTION_NAME = "users";
const collectionRef = firestore.collection(COLLECTION_NAME);

export const findUsersList = async (requestQuery?: any) => {
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

  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return {
    users,
    size: snapshot.size,
  };
};

export const findUserById = async (id: string) => {
  const user = await collectionRef.doc(id).get();

  if (!user.exists) {
    return null;
  }

  return {
    id: user.id,
    ...user.data(),
  };
};

export const modifyUserById = async (id: string, body: UpdateUserRequestBody) =>
  collectionRef.doc(id).update(body);

export const removeUserById = async (id: string) =>
  collectionRef.doc(id).delete();

export const saveUser = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const user = await collectionRef.add(body);
  console.log("created user", user);
  return {
    id: user.id,
    name: "user.name",
    email: "user.name",
  };
};
