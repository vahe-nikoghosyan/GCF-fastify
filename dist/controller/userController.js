"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserById = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const enum_1 = require("../types/enum");
const user_entitiy_1 = require("../database/Entities/user-entitiy");
function getUsers(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { users, size } = yield (0, user_entitiy_1.getUsersList)();
            reply.status(enum_1.StatusCode.OK).send({ users, size, offset: 1 });
        }
        catch (error) {
            console.log("error", error);
            reply.status(enum_1.StatusCode.BAD_REQUEST).send("Error while getting");
        }
    });
}
exports.getUsers = getUsers;
function getUserById(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = request.params.id;
        try {
            // Retrieve the user from your database using the provided ID
            // const user = await getUserByIdFromDatabase(id);
            const user = {
                id,
            };
            if (!user) {
                reply.status(enum_1.StatusCode.NOT_FOUND).send({
                    error: "User not found",
                });
            }
            reply.status(enum_1.StatusCode.OK).send(user);
        }
        catch (error) {
            console.error("Error retrieving user:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send({
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
    });
}
exports.getUserById = getUserById;
function createUser(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = request.body;
        if (!(name && email && password)) {
            return reply.status(enum_1.StatusCode.BAD_REQUEST).send({
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
            reply.status(enum_1.StatusCode.CREATED).send({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        }
        catch (error) {
            console.error("Error creating user:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send({
                error: "Error creating user",
            });
        }
    });
}
exports.createUser = createUser;
function updateUserById(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
        if (!(id && id.length)) {
            reply.status(enum_1.StatusCode.BAD_REQUEST).send({
                error: "Empty ID",
            });
        }
        const { name, email } = request.body;
        try {
            // await updateUserInDB(id, { name, email });
            reply.status(enum_1.StatusCode.OK).send({
                message: "User updated successfully!",
            });
        }
        catch (error) {
            console.error("Error updating user:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send({
                error: "Error updating user",
            });
        }
    });
}
exports.updateUserById = updateUserById;
function deleteUser(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete the user from your database using the provided ID
            // await deleteUserFromDatabase(id);
            reply.status(enum_1.StatusCode.OK).send({
                message: "User deleted successfully",
            });
        }
        catch (error) {
            console.error("Error deleting user:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send({
                error: "Error deleting user",
            });
        }
    });
}
exports.deleteUser = deleteUser;
