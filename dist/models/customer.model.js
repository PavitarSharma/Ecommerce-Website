"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = require("mongoose");
var Role;
(function (Role) {
    Role["Customer"] = "customer";
    Role["Admin"] = "admin";
})(Role || (Role = {}));
const customerSchema = new mongoose_1.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: { type: String, unique: true },
    bio: String,
    username: String,
    location: Array,
    profileImg: {
        id: String,
        url: String,
    },
    verified: { type: Boolean, default: false },
    cart: { type: [Object], default: [] },
    wishlists: { type: [Object], default: [] },
    orders: { type: [Object], default: [] },
    roles: {
        type: [{ type: String, enum: Object.values(Role) }],
        default: [Role.Customer],
    },
    device: String,
    loginDevices: { type: [{ device: String, count: Number }], default: [] },
    acceptTerms: { type: Boolean, default: false },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
        },
    },
    timestamps: true,
});
exports.Customer = (0, mongoose_1.model)("Customer", customerSchema);
//# sourceMappingURL=customer.model.js.map