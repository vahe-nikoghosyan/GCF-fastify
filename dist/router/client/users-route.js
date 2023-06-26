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
        app
            .addHook("preHandler", app.auth([app.verifyLevel, app.verifyVIP]))
            .addHook("preValidation", app.validatePaginationRequestQuery)
            .get("/", (0, users_swagger_1.getUsersSwaggerOptions)([enum_1.Tags.CLIENT_USER]), userController_1.getUsers);
        // app.route({
        //   method: "GET",
        //   url: "/all",
        //   preHandler: app.auth(
        //     [[app.verifyUserPassword, app.verifyLevel], app.verifyVIP],
        //     {
        //       relation: "or",
        //     }
        //   ),
        //   handler: (req, reply) => {
        //     req.log.info("Auth route");
        //     reply.send({ hello: "world" });
        //   },
        // });
        app.addHook("preValidation", app.validateParamsID).get("/:id", (0, users_swagger_1.getUserByIdSwaggerOptions)([enum_1.Tags.CLIENT_USER]), userController_1.getUserById);
        app.addHook("preValidation", app.validateParamsID).put("/:id", (0, users_swagger_1.updateUserSwaggerOptions)([enum_1.Tags.CLIENT_USER]), userController_1.updateUserById);
        app.post("/", (0, users_swagger_1.createUserSwaggerOptions)([enum_1.Tags.CLIENT_USER]), userController_1.createUser);
        app.addHook("preValidation", app.validateParamsID).delete("/:id", (0, users_swagger_1.deleteUserSwaggerOptions)([enum_1.Tags.CLIENT_USER]), userController_1.deleteUser);
    });
}
exports.usersRoute = usersRoute;
