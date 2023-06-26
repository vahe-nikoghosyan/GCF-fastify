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
exports.isAuthenticated = exports.asyncVerifyJWT = exports.validatePaginationRequestQuery = exports.validateParamsID = exports.verifyVIP = exports.verifyLevel = exports.verifyUserPassword = void 0;
const index_1 = require("../index");
const enum_1 = require("../types/enum");
function verifyUserPassword(request, reply, done) {
    done({ error: "Wrong password!" });
}
exports.verifyUserPassword = verifyUserPassword;
function verifyLevel(request, reply, done) {
    done();
}
exports.verifyLevel = verifyLevel;
function verifyVIP(request, reply, done) {
    done();
}
exports.verifyVIP = verifyVIP;
function validateParamsID(request, reply, done) {
    const id = request.params.id.replace(/[^a-zA-Z0-9]/g, "").trim();
    if (!(id && id.length)) {
        reply.status(enum_1.StatusCode.BAD_REQUEST).send({ error: "Invalid ID" });
    }
    done();
}
exports.validateParamsID = validateParamsID;
function validatePaginationRequestQuery(request, reply, done) {
    const requestQuery = request.query;
    if (!Object.keys(requestQuery).length) {
        done();
    }
    const { offset, limit } = requestQuery;
    if (offset != null && offset < 1) {
        reply
            .status(enum_1.StatusCode.BAD_REQUEST)
            .send({ message: "Offset should be greater than 0" });
    }
    if (limit != null && limit > enum_1.QueryOptions.MAXIMUM_LIMIT_OF_LIST) {
        reply.status(enum_1.StatusCode.BAD_REQUEST).send({
            message: `Limit should be smaller than ${enum_1.QueryOptions.MAXIMUM_LIMIT_OF_LIST}`,
        });
    }
    if (limit != null && limit < enum_1.QueryOptions.MINIMUM_LIMIT_OF_LIST) {
        reply.status(enum_1.StatusCode.BAD_REQUEST).send({
            message: `Limit should be greater than ${enum_1.QueryOptions.MINIMUM_LIMIT_OF_LIST}`,
        });
    }
    done();
}
exports.validatePaginationRequestQuery = validatePaginationRequestQuery;
function asyncVerifyJWT(request, reply, done) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        done();
    });
}
exports.asyncVerifyJWT = asyncVerifyJWT;
function isAuthenticated(request, reply, done) {
    const token = request.headers.authorization;
    try {
        index_1.appInstance.jwt.verify(token);
        done();
    }
    catch (error) {
        reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send({
            error: "Invalid token.",
        });
    }
}
exports.isAuthenticated = isAuthenticated;
