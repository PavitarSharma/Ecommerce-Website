"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMPT_SERVICE = exports.SMTP_PASSWORD = exports.SMTP_MAIL = exports.SMTP_PORT = exports.SMTP_HOST = exports.BACKEND_URL = exports.CLIENT_URL = exports.ACTIVATION_SECRET = exports.REFRESH_TOKEN = exports.ACCESS_TOKEN = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.AWS_REGION = exports.AWS_BUCKET_NAME = exports.PORT = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 5000;
exports.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
exports.AWS_REGION = process.env.AWS_REGION;
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.ACCESS_TOKEN = process.env.ACCESS_TOKEN;
exports.REFRESH_TOKEN = process.env.REFRESH_TOKEN;
exports.ACTIVATION_SECRET = process.env.ACTIVATION_SECRET;
exports.CLIENT_URL = process.env.CLIENT_URL;
exports.BACKEND_URL = process.env.BACKEND_URL;
exports.SMTP_HOST = process.env.SMTP_HOST;
exports.SMTP_PORT = process.env.SMTP_PORT;
exports.SMTP_MAIL = process.env.SMTP_MAIL;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;
exports.SMPT_SERVICE = process.env.SMPT_SERVICE;
//# sourceMappingURL=environment.js.map