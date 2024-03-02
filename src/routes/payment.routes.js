import express from "express";
import { paymentController } from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/process", paymentController.createPaymentIntent)

export default router;