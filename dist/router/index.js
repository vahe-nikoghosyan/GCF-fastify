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
const enum_1 = require("../types/enum");
function apiRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/info", (request, reply) => {
            reply.status(enum_1.StatusCode.OK).send(Object.assign(Object.assign({}, process.versions), { timestamp: Date.now(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, timezoneOffset: new Date().getTimezoneOffset() }));
        });
    });
}
exports.default = apiRoute;
