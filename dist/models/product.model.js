"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    price: Number,
    currency: String,
    brand: String,
    stock: Number,
    brand_logo: String,
    images: (Array),
    category: String,
    rating: {
        rate: Number,
        count: Number,
    },
    like: { type: Boolean, default: false },
    carts: Array,
    visited: Number,
    color: String,
}, {
    timestamps: true,
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
//# sourceMappingURL=product.model.js.map