import { Product } from "../models/product.model.js";
import { generateUploadURLs } from "../utils/aws.js";
import { customerService } from "./customer.service.js";

class ProductService {
  async uploadProductMedia(file) {
    return await generateUploadURLs(file);
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async findProductById(id) {
    return await Product.findById(id);
  }

  async allProducts(params) {
    const { q, category, sortBy, size, color, type, price } = params;
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

    let sortCriteria = {};
    if (sortBy === "Date added, newest to oldest") {
      sortCriteria.createdAt = -1;
    } else if (sortBy === "Date added, oldest to newest") {
      sortCriteria.createdAt = 1;
    } else if (sortBy === "Name, A to Z") {
      sortCriteria.title = 1;
    } else if (sortBy === "Name, Z to A") {
      sortCriteria.title = -1;
    } else if (sortBy === "Price, low to high") {
      sortCriteria.price = 1;
    } else if (sortBy === "Price, high to low") {
      sortCriteria.price = -1;
    }

    if (size) {
      query.sizes = size;
    }

    if (color) {
      query["images.color"] = color;
    }

    if (type) {
      query.name = type;
    }

    if (price) {
      const [minPrice, maxPrice] = price
        .split("-")
        .map((p) => parseFloat(p.trim()));
      query.price = {
        $gte: isNaN(minPrice) ? Number.MIN_VALUE : minPrice,
        $lte: isNaN(maxPrice) ? Number.MAX_VALUE : maxPrice,
      };
    }

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortCriteria).exec(),
      Product.countDocuments(query).exec(),
    ]);
    const totalPages = Math.ceil(total / limit);

    return { products, total, totalPages };
  }

  async getNewArrivals(params) {
    // const startDate = new Date();
    // const endDate = new Date();
    // endDate.setDate(endDate.getDate() + 7);

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);
    
    const { q, category, sortBy, size, color, type, price } = params;
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

    let sortCriteria = {};
    if (sortBy === "Date added, newest to oldest") {
      sortCriteria.createdAt = -1;
    } else if (sortBy === "Date added, oldest to newest") {
      sortCriteria.createdAt = 1;
    } else if (sortBy === "Name, A to Z") {
      sortCriteria.title = 1;
    } else if (sortBy === "Name, Z to A") {
      sortCriteria.title = -1;
    } else if (sortBy === "Price, low to high") {
      sortCriteria.price = 1;
    } else if (sortBy === "Price, high to low") {
      sortCriteria.price = -1;
    }

    if (size) {
      query.sizes = size;
    }

    if (color) {
      query["images.color"] = color;
    }

    if (type) {
      query.name = type;
    }

    if (price) {
      const [minPrice, maxPrice] = price
        .split("-")
        .map((p) => parseFloat(p.trim()));
      query.price = {
        $gte: isNaN(minPrice) ? Number.MIN_VALUE : minPrice,
        $lte: isNaN(maxPrice) ? Number.MAX_VALUE : maxPrice,
      };
    }

    console.log("Start Date: ", startDate)
    console.log("End Date: ", endDate);;

    query.createdAt = { $gte: startDate, $lte: endDate };

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortCriteria).exec(),
      Product.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return { products, total, totalPages };
  }

  async addToWishlist(body, customerId) {
    const { productId, like } = body;
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Customer not found", 404);
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }
    const wishlistProductIndex = customer.wishlists.findIndex(
      (item) => item && item._id && item._id.toString() === productId
    );

    product.like = like;
    await product.save();
    if (like) {
      // If like is true, add the product to customer's wishlist
      if (wishlistProductIndex === -1) {
        customer.wishlists.push(product);
        await customer.save();
      }
    } else {
      // If like is false, remove the product from customer's wishlist
      if (wishlistProductIndex !== -1) {
        customer.wishlists.splice(wishlistProductIndex, 1);
        await customer.save();
      }
    }

    return product;
  }

  async addToCart(productCart, customerId, quantity) {
    const productId = productCart._id;
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const existingCartItem = customer.carts.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity = quantity;
    } else {
      customer.carts.push({
        product: productCart,
        quantity: quantity,
      });
    }

    const cartResult = await customer.save();

    return cartResult.carts;
  }

  async increaseCartQuantity(productId, customerId) {
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const existingCartItem = customer.carts.find(
      (item) => item.product._id.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    }
    const cartResult = await customer.save();

    return cartResult.carts;
  }

  async decreaseCartQuantity(productId, customerId) {
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const existingCartItemIndex = customer.carts.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (existingCartItemIndex !== -1) {
      // Decrease quantity by 1
      customer.carts[existingCartItemIndex].quantity -= 1;

      // If quantity becomes zero, remove the cart item
      if (customer.carts[existingCartItemIndex].quantity === 0) {
        customer.carts.splice(existingCartItemIndex, 1);
      }
    }

    const cartResult = await customer.save();

    return cartResult.carts;
  }

  async removeFromCart(productId, customerId) {
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const productIndex = customer.carts.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (productIndex !== -1) {
      customer.carts.splice(productIndex, 1);
    }
    const cartResult = await customer.save();
    return cartResult.carts;
  }

  async removeAllItemsFromCart(customerId) {
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    customer.carts = [];
    const cartResult = await customer.save();
    return cartResult.carts;
  }

  // -------------------- Review --------------------
  async createReview(customerId, body) {
    const { productId, message, rating } = body;
    const customer = await customerService.findById(customerId);
    if (!customer) {
      throw new ErrorHandler("Unauthorized please login to access", 404);
    }

    const product = await this.findProductById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const newReview = {
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        profileImg: customer.profileImg,
      },
      rating,
      message,
    };

    product.reviews.push(newReview);
    await product.save();
    const newIndex = product.reviews.length - 1;

    // Access the newly added review object
    const createdReview = product.reviews[newIndex];

    return createdReview;
  }

  async getReviews(productId) {
    const product = await this.findProductById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const sortedReviews = product.reviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return sortedReviews;
  }

  async updateReview(productId, reviewId, body) {
    const product = await this.findProductById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const reviewIndex = product.reviews.findIndex(
      (item) => item._id.toString() === reviewId
    );

    if (reviewIndex !== -1) {
      product.reviews[reviewIndex] = body;
    }
    await product.save();

    return product.reviews[reviewIndex];
  }

  async deleteReview(productId, reviewId) {
    const product = await this.findProductById(productId);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const reviewIndex = product.reviews.findIndex(
      (item) => item._id.toString() === reviewId
    );

    if (reviewIndex !== -1) {
      product.reviews.splice(reviewIndex, 1);
    }

    await product.save();

    return product.reviews;
  }
}

export const productService = new ProductService();
