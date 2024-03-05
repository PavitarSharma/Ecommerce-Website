import { productService } from "../services/product.service.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class ProductController {
  async uploadProductMedia(req, res, next) {
    const file = req.files;

    if (!file) {
      return next(new ErrorHandler("No file uploaded", 400));
    }

    const uploadImage = await productService.uploadProductMedia(file);

    res.status(200).json(uploadImage);
  }

  async create(req, res, next) {
    const product = await productService.addProduct(req.body);
    res.status(200).json(product);
  }

  async allProducts(req, res, next) {
    const products = await productService.allProducts(req.query);
    res.status(200).json(products);
  }

  async getProduct(req, res, next) {
    const productId = req.params.id;
    const product = await productService.findProductById(productId);
    await product.calculateRating(); 
    res.status(200).json(product);
  }

  async getNewArrivals(req, res, next) {
    const products = await productService.getNewArrivals(req.query);
    res.status(200).json(products);
  }

  // --------------------- Reviews --------------------
  async createReview(req, res, next) {
    const customerId = req.user;
    if (!customerId) {
      return next(new ErrorHandler("Unauthorized please login to access", 404));
    }
    const review = await productService.createReview(customerId, req.body);
    res.status(200).json({
      message: "Review added successfully",
      review,
    });
  }

  async getReviews(req, res, next) {
    const productId = req.params.id;
    const reviews = await productService.getReviews(productId);
    res.status(200).json(reviews);
  }

  async updateReview(req, res, next) {
    const reviewId = req.params.reviewId;
    const productId = req.params.id;
    const review = await productService.updateReview(productId, reviewId, req.body);
    res.status(200).json(review);
  }

  async deleteReview(req, res, next) {
    const reviewId = req.params.reviewId;
    const productId = req.params.id;
    const review = await productService.deleteReview(productId, reviewId);
    res.status(200).json(review);
  }
}

export const productController = new ProductController();
