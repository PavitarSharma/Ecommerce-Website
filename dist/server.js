"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, morgan_1.default)("dev"));
app.set("view engine", "ejs");
// Setting for the root path for views directory
app.set("views", path_1.default.join(__dirname, "views"));
app.get("/", (req, res) => {
    res.render("activation-account-mail", {
        name: "John Doe",
        url: "http://localhost:3000",
    });
});
app.use("/api", routes_1.routes);
app.use("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Not Found",
    });
});
app.use(middlewares_1.errorHandler);
exports.default = app;
//# sourceMappingURL=server.js.map