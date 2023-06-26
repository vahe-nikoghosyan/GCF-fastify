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
exports.uploadFile = exports.createSignedUrl = exports.getSignedUrl = exports.getImage = exports.getFile = void 0;
const storage_1 = require("@google-cloud/storage");
const enum_1 = require("../types/enum");
const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";
const bucketName = "bucket_assets_num1";
const storage = new storage_1.Storage({
    projectId: process.env["PROJECT_ID"] || "",
    keyFilename: keyFilePath,
});
function getFile(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = "example.txt";
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            const [fileContent] = yield file.download();
            reply.status(enum_1.StatusCode.OK).type("text").send(fileContent);
        }
        catch (error) {
            console.error("Error:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send("Error getting file.");
        }
    });
}
exports.getFile = getFile;
function getImage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = "Hotpot.png";
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            const [fileContent] = yield file.download();
            reply.type("image/png").status(enum_1.StatusCode.OK).send(fileContent);
        }
        catch (error) {
            console.error("Error:", error);
            reply.status(enum_1.StatusCode.INTERNAL_SERVER_ERROR).send("Error getting image.");
        }
    });
}
exports.getImage = getImage;
function getSignedUrl(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = "Hotpot.png";
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            const options = {
                action: "read",
                expires: Date.now() + 15 * 60 * 1000, // URL expiration time in milliseconds
            };
            const [url] = yield file.getSignedUrl(options);
            reply.status(enum_1.StatusCode.OK).send(url);
        }
        catch (error) {
            console.error("Error:", error);
            reply
                .status(enum_1.StatusCode.INTERNAL_SERVER_ERROR)
                .send("Error getting sign-url.");
        }
    });
}
exports.getSignedUrl = getSignedUrl;
function createSignedUrl(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fileName } = request.body;
            if (!fileName) {
                reply.status(enum_1.StatusCode.BAD_REQUEST).send("File name required");
            }
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            const options = {
                version: "v4",
                action: "write",
                expires: Date.now() + 15 * 60 * 1000,
                contentType: "image/png",
            };
            const [url] = yield file.getSignedUrl(options);
            reply.status(enum_1.StatusCode.OK).send(url);
        }
        catch (error) {
            console.error("Error:", error);
            reply
                .status(enum_1.StatusCode.INTERNAL_SERVER_ERROR)
                .send("Error getting sign-url.");
        }
    });
}
exports.createSignedUrl = createSignedUrl;
function uploadFile(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = "example.txt";
            const fileContent = "Hello, Cloud Storage";
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(fileName);
            yield file.save(fileContent);
            reply.status(enum_1.StatusCode.OK).send("File uploaded successfully!");
        }
        catch (err) {
            console.log("err", err);
            reply
                .status(enum_1.StatusCode.INTERNAL_SERVER_ERROR)
                .send("Error uploading file.");
        }
    });
}
exports.uploadFile = uploadFile;
