"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { colorize, combine, timestamp, json, printf } = winston_1.format;
exports.logger = (0, winston_1.createLogger)({
    format: combine(colorize(), timestamp(), json(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [new winston_1.transports.Console()],
    exceptionHandlers: [new winston_1.transports.File({ filename: "exceptions.log" })],
    rejectionHandlers: [new winston_1.transports.File({ filename: "rejections.log" })],
});
//# sourceMappingURL=logger.js.map