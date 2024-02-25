import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const { model } = mongoose;

const Role = {
  Customer: "customer",
  Admin: "admin",
};

const customerSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    bio: String,
    username: String,
    location: Array,
    profileImg: {
      id: String,
      url: String,
    },
    verified: { type: Boolean, default: false },
    carts: [
      {
        product: {
          type: MongooseSchema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    wishlists: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: "Order",
      },
    ],
    roles: {
      type: [{ type: String, enum: Object.values(Role) }],
      default: [Role.Customer],
    },
    device: String,
    loginDevices: { type: [{ device: String, count: Number }], default: [] },
    acceptTerms: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

customerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Customer = model("Customer", customerSchema);
