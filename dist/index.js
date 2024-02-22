"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
const config_1 = require("./config");
const db_1 = require("./utils/db");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)();
server_1.default.listen(PORT, () => config_1.logger.info(`Server listening on ${PORT}`));
//# sourceMappingURL=index.js.map