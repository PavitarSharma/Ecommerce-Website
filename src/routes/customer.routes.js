import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { customerController } from "../controllers/customer.controller.js";


const router = express.Router();


router.post("/register", customerController.register);
router.post("/verify", customerController.verifyEmail);
router.post("/login", customerController.login);
router.post("/resend-verification", customerController.resendVerification);
router.get("/refresh", customerController.generateRefreshToken)

router.use(isAuthenticated)
router.get("/profile", customerController.customerProfile)
router.post("/logout", customerController.logout)
export default router
