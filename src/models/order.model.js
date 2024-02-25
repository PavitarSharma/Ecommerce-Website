import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orderId: String,
    totalAmmount: Number,
    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    paymentMethod: String,
    paymentResponse: String,
    orderStatus: String,
    orderDate: Date,
  },
  {
    timestamps: true,
  }
);


export const Order = model("Order", orderSchema);