import { Schema, model, Document } from "mongoose";
import { Image } from "../types";

export interface ProductDoc extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  brand: string;
  stock: number;
  brand_logo: string;
  images: Array<Image>;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  like: boolean;
  carts: any[];
  visited: number;
  color: string;
}

const productSchema = new Schema<ProductDoc>(
  {
    title: String,
    description: String,
    price: Number,
    currency: String,
    brand: String,
    stock: Number,
    brand_logo: String,
    images: Array<Image>,
    category: String,
    rating: {
      rate: Number,
      count: Number,
    },
    like: { type: Boolean, default: false },
    carts: Array,
    visited: Number,
    color: String,
  },
  {
    timestamps: true,
  }
);

export const Product = model<ProductDoc>("Product", productSchema);
