import mongoose, { Schema } from "mongoose";

const { model, Schema: MongooseSchema } = mongoose;

const productSchema = new MongooseSchema(
  {
    title: String,
    description: String,
    price: Number,
    currency: String,
    stock: Number,
    descountType: String,
    discountPrice: Number,
    sku: String,
    barcode: String,
    size: String,
    images: [
      {
        url: String,
        color: String,
      },
    ],
    category: String,
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    like: { type: Boolean, default: false },
    visited: Number,
    shippingPrice: Number,
    tax: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
