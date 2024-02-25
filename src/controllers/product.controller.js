
import { productService } from "../services/product.service.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class ProductController {
  async uploadProductMedia(req, res, next) {
    const file = req.file;

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

  

  
}

export const productController = new ProductController();
