import { Schema, model, Document } from "mongoose";
import { Address, Image } from "../types";
import bcrypt from "bcrypt"
enum Role {
  Customer = "customer",
  Admin = "admin",
}

export interface CustomerDoc extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  bio: string;
  username: string;
  location: Address[];
  profileImg: Image;
  verified: boolean;
  cart: [any];
  wishlists: [any];
  orders: [any];
  roles: Role[];
  device: string;
  loginDevices: { device: string; count: number }[];
  acceptTerms: boolean;
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const customerSchema = new Schema<CustomerDoc>(
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

customerSchema.pre<CustomerDoc>('save', async function(next){
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword =  await bcrypt.hash(this.password, 10)
  this.password = hashedPassword

  next()
})


customerSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Customer = model<CustomerDoc>("Customer", customerSchema);
