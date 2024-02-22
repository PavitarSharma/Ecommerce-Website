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
exports.generateUploadURL = exports.s3client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const config_1 = require("../config");
require("dotenv").config();
exports.s3client = new client_s3_1.S3Client({
    region: config_1.AWS_REGION,
    credentials: {
        accessKeyId: config_1.AWS_ACCESS_KEY_ID,
        secretAccessKey: config_1.AWS_SECRET_ACCESS_KEY,
    },
});
const generateUploadURL = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const imageName = `${(0, uuid_1.v4)()}-${date.getTime()}.png`;
    const param = {
        Bucket: config_1.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
    };
    yield exports.s3client.send(new client_s3_1.PutObjectCommand(param));
    return `https://${config_1.AWS_BUCKET_NAME}.s3.${config_1.AWS_REGION}.amazonaws.com/${param.Key}`;
});
exports.generateUploadURL = generateUploadURL;
//# sourceMappingURL=aws.js.map