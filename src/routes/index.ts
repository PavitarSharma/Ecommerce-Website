import express from "express";
import { customerRoutes } from "./customer.routes";
import { productRoutes } from "./product.routes";
const router = express.Router();

router.use("/customers", customerRoutes);
router.use("/products", productRoutes);

export { router as routes };
