import express from "express";
import { productController } from "../controllers/product.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/upload-media",upload.single("file"), productController.uploadProductMedia)
router.get("/", productController.allProducts)

router.post("/", productController.create);
router.use(isAuthenticated)
router.post("/wishlist", productController.addToWishlist)


export default router;
