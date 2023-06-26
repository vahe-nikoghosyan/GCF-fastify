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
exports.storageRoute = void 0;
const storageCantroller_1 = require("../../controller/storageCantroller");
function storageRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/file", storageCantroller_1.getFile);
        app.get("/image", storageCantroller_1.getImage);
        app.get("/signed-url", storageCantroller_1.getSignedUrl);
        app.post("/signed-url", storageCantroller_1.createSignedUrl);
        app.post("/upload-file", storageCantroller_1.uploadFile);
    });
}
exports.storageRoute = storageRoute;
