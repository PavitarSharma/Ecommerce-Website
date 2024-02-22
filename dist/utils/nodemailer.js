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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, email, template, dynamicData } = emailData;
    const templatePath = path_1.default.join(__dirname, "../views", `${template}.ejs`);
    const html = yield ejs_1.default.renderFile(templatePath, dynamicData);
    try {
        const transportConfig = {
            host: config_1.SMTP_HOST,
            port: Number(config_1.SMTP_PORT),
            secure: true,
            service: config_1.SMPT_SERVICE,
            auth: {
                user: config_1.SMTP_MAIL,
                pass: config_1.SMTP_PASSWORD,
            },
        };
        const transporter = nodemailer_1.default.createTransport(transportConfig);
        const mailOptions = {
            from: config_1.SMTP_MAIL,
            to: email,
            subject,
            html: template,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error rendering EJS template:", error);
        throw error;
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=nodemailer.js.map