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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersList = exports.COLLECTION_NAME = void 0;
const database_1 = __importDefault(require("../../database"));
exports.COLLECTION_NAME = "users";
const getUsersList = (requestQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionRef = database_1.default.collection(exports.COLLECTION_NAME);
    let query = collectionRef;
    if (Object.keys(requestQuery).length) {
        const { limit, offset, page } = requestQuery, rest = __rest(requestQuery, ["limit", "offset", "page"]);
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
    const snapshot = yield (query || collectionRef).get();
    const users = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    return {
        users,
        size: snapshot.size,
    };
});
exports.getUsersList = getUsersList;
