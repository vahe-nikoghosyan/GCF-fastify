import firestore from "../../database";

export const COLLECTION_NAME = "users";

export const getUsersList = async (requestQuery?: any) => {
  const collectionRef = firestore.collection(COLLECTION_NAME);

  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    collectionRef;

  if (Object.keys(requestQuery).length) {
    const { limit, offset, page, ...rest } = requestQuery;

    Object.entries(rest).forEach(([key, value]) => {
      query = query.where(key, "==", value);
    });

    if (limit != null) {
      query = query.limit(Number(limit));
    }

    // if (offset != null) {
    //   if (offset < 1) {
    //     reply
    //       .status(StatusCode.BAD_REQUEST)
    //       .send({ message: "Offset should be greater than 0" });
    //   }
    //
    //   query = query.offset((Number(page) - 1) * (offset ?? 10));
    // }
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
