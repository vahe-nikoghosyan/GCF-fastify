import { StatusCode } from "../@types/enum";
import { getUsersList } from "../database/Entities/user-entitiy";

async function getUsers(request, reply) {
  try {
    const { users, size } = await getUsersList();

    reply.status(StatusCode.OK).send({ users, size, offset: 1 });
  } catch (error) {
    console.log("error", error);
    reply.status(StatusCode.BAD_REQUEST).send("Error while getting");
  }
}

async function getUserById(request, reply) {
  const id = request.params.id;
  try {
    // Retrieve the user from your database using the provided ID
    // const user = await getUserByIdFromDatabase(id);
    const user = {
      id,
    };

    if (!user) {
      reply.status(StatusCode.NOT_FOUND).send({
        error: "User not found",
      });
    }

    reply.status(StatusCode.OK).send(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error retrieving user",
    });
  }

  // const collectionRef = firestore.collection(COLLECTION_NAME);
  // const user = await collectionRef.doc(id).get();
  //
  // reply.status(StatusCode.OK).send({
  //   id: user.id,
  //   ...user.data(),
  // });
}

async function createUser(request, reply) {
  const { name, email, password } = request.body;

  if (!(name && email && password)) {
    return reply.status(StatusCode.BAD_REQUEST).send({
      error: "Invalid request body",
    });
  }

  try {
    // const user = await createUserInDB(name, email, password);
    const user = {
      id: 1,
      name: "name",
      email: "email",
    };

    reply.status(StatusCode.CREATED).send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error creating user",
    });
  }
}

async function updateUserById(request, reply) {
  const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!(id && id.length)) {
    reply.status(StatusCode.BAD_REQUEST).send({
      error: "Empty ID",
    });
  }

  const { name, email } = request.body;

  try {
    // await updateUserInDB(id, { name, email });

    reply.status(StatusCode.OK).send({
      message: "User updated successfully!",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error updating user",
    });
  }
}

async function deleteUser(request, reply) {
  try {
    // Delete the user from your database using the provided ID
    // await deleteUserFromDatabase(id);

    reply.status(StatusCode.OK).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    reply.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: "Error deleting user",
    });
  }
}

export { getUsers, getUserById, createUser, updateUserById, deleteUser };
