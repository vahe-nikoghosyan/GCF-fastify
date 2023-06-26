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
exports.usersRoute = void 0;
const userController_1 = require("../../controller/userController");
const enum_1 = require("../../types/enum");
const users_swagger_1 = require("../swagger/users-swagger");
function usersRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/:id", (0, users_swagger_1.getUserByIdSwaggerOptions)([enum_1.Tags.ADMIN_USER]), userController_1.getUserById);
        app.post("/login", (request, reply) => {
            const token = app.jwt.sign({ userId: "userID" });
            reply.send({ token });
        });
        app.get("/protected", { preValidation: app.isAuthenticated }, (request, reply) => {
            const decoded = app.jwt.verify(request.headers.authorization);
            reply.send({ message: "Protected route", user: decoded });
        });
    });
}
exports.usersRoute = usersRoute;
