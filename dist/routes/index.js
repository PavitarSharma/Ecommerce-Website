"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const customer_routes_1 = require("./customer.routes");
const product_routes_1 = require("./product.routes");
const router = express_1.default.Router();
exports.routes = router;
router.use("/customers", customer_routes_1.customerRoutes);
router.use("/products", product_routes_1.productRoutes);
//# sourceMappingURL=index.js.map