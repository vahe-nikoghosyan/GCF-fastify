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
const users_route_1 = require("./users-route");
const storage_route_1 = require("./storage-route");
const pub_sub_route_1 = require("./pub-sub-route");
function clientRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register(users_route_1.usersRoute, { prefix: "/users" });
        app.register(storage_route_1.storageRoute, { prefix: "/storage" });
        app.register(pub_sub_route_1.pubSubRoute, { prefix: "/pub-sub" });
    });
}
exports.default = clientRoute;
