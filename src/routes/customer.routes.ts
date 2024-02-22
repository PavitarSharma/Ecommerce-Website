import express from "express";
import { customerController } from "../controllers";
import { isAuthenticated } from "../middlewares";

const router = express.Router();


router.post("/register", customerController.register);
router.post("/verify", customerController.verifyEmail);
router.post("/login", customerController.login);
router.post("/resend-verification", customerController.resendVerification);
router.get("/refresh", customerController.generateRefreshToken)

router.use(isAuthenticated)
router.get("/profile", customerController.customerProfile)

export { router as customerRoutes };
