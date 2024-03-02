import mongoose, { Schema } from "mongoose";

const { model, Schema: MongooseSchema } = mongoose;

const reviewSchema = new Schema(
  {
    customer: Object,
    rating: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);


const imagesSchema = new Schema({
  medias: [
    {
      id: String,
      url: String,
    },
  ],
  color: String,
});

export const productSchema = new MongooseSchema(
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
    sizes: [String],
    images: [imagesSchema],
    category: String,
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    like: { type: Boolean, default: false },
    visited: Number,
    shippingPrice: Number,
    purchased: { type: Number, default: 0 },
    condition: String,
    type: String,
    reviews: [reviewSchema],
    quality: String,
    name: String
  },
  {
    timestamps: true,
  }
);

productSchema.methods.calculateRating = function () {
  const totalReviews = this.reviews.length;
  if (totalReviews === 0) return;

  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating = totalRating / totalReviews;

  this.rating.rate = averageRating;
  this.rating.count = totalReviews;
};

productSchema.post("save", function () {
  this.calculateRating();
});

export const Product = model("Product", productSchema);
