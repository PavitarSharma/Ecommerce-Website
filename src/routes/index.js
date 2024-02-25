import express from "express";
import customerRoutes from "./customer.routes.js";
import productRoutes  from "./product.routes.js";
const router = express.Router();

router.use("/customers", customerRoutes);
router.use("/products", productRoutes);

export default router;
