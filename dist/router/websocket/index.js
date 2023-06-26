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
function websocketRoute(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get("/*", { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
            const wss = connection.socket;
            wss.on("close", (message) => {
                // message.toString() === 'hi from client'
                wss.send("close");
            });
            wss.on("message", (message) => {
                // message.toString() === 'hi from client'
                wss.send("hi from wildcard route");
            });
        });
        app.get("/", { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
            const wss = connection.socket;
            wss.on("message", (message) => {
                const body = JSON.parse(message.toString());
                if (body.close) {
                    wss.close();
                }
                wss.send("hi from server");
            });
        });
    });
}
exports.default = websocketRoute;
