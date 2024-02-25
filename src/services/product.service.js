import { Product } from "../models/product.model.js";
import { generateUploadURL } from "../utils/aws.js";


class ProductService {
  async uploadProductMedia(file) {
    return await generateUploadURL(file);
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async allProducts(params) {
    const { q, category = "" } = params;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;
    let query = {};
    if (category) {
      query.category = category;
    }
    if (q) {
      query.title = { $regex: new RegExp(q, "i") };
    }

    return await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async addToWishlist(body, customerId) {
    console.log(customerId);
    console.log(body);
  }
}

export const productService = new ProductService();
