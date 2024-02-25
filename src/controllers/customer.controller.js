import { CLIENT_URL } from "../config/environment.js";
import { logger } from "../config/logger.js";
import { customerService } from "../services/customer.service.js";
import { mailService } from "../services/mail.service.js";
import { productService } from "../services/product.service.js";
import { tokenService } from "../services/token.service.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class CustomerController {
  async register(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;
    if (!name) return next(new ErrorHandler("Name is required", 400));
    if (!email) return next(new ErrorHandler("Email is required", 400));
    if (!password) return next(new ErrorHandler("Password is required", 400));
    if (!confirmPassword)
      return next(new ErrorHandler("Confirm password is required", 400));
    if (password !== confirmPassword)
      return next(new ErrorHandler("Passwords do not match", 400));

    const existingCustomer = await customerService.findByEmail(email);
    // if (existingCustomer) {
    //   if (existingCustomer.verified) {
    //     return next(new ErrorHandler("Email is already registered", 400));
    //   } else {
    //     return next(
    //       new ErrorHandler("Email is already registered but not verified", 400)
    //     );
    //   }
    // }
    if (existingCustomer) {
      return next(
        new ErrorHandler("Email is already registered but not verified", 400)
      );
    }

    await customerService.register(req.body);
    const activationToken = await customerService.generateVerificationToken(
      customer._id,
      email
    );
    const verificationUrl = `${CLIENT_URL}/verification?token=${activationToken}&email=${email}`;
    await mailService.verificationMail(
      { ...req.body, href: verificationUrl },
      "activation-account-mail"
    );
    logger.info("Registration successful done");
    res.status(201).json({
      // email,
      // message: `An activation mail has been sent to ${email}`,
      message: "Registration successful done",
    });
  }

  async verifyEmail(req, res, next) {
    const { token } = req.body;
    if (!token)
      return next(new ErrorHandler("Verification token is required", 400));

    const decodedToken = await customerService.accountVerified(token);
    if (!decodedToken)
      return next(new ErrorHandler("Invalid verification token", 400));

    const { email, exp } = decodedToken;
    if (Date.now() >= exp * 1000) {
      return next(new ErrorHandler("Verification token has expired", 400));
    }

    logger.info("User verified email");

    res.status(200).json({ message: "User verified" });
  }

  async login(req, res, next) {
    const { email, password, device } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));
    if (!password) return next(new ErrorHandler("Password is required", 400));
    const customer = await customerService.findByEmail(email);
    if (!customer)
      return next(new ErrorHandler("Invalid email or password", 400));

    // if (!customer.verified)
    //   return next(new ErrorHandler("User not verified", 400));

    const validPassword = await customer.comparePassword(password);
    if (!validPassword)
      return next(new ErrorHandler("Invalid email or password", 400));

    await customerService.updateLoginDevices(customer, device);
    const { access_token, refresh_token } = await tokenService.generateToken({
      id: customer._id,
    });
    res.cookie("first_link_exim_token", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ access_token, customer });
  }

  async resendVerification(req, res, next) {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));
    const customer = await customerService.findByEmail(email);
    if (!customer) return next(new ErrorHandler("User does not exist", 404));

    await mailService.verificationMail({ ...req.body, otp }, "resend-otp-mail");
    logger.info("Resend verification email");
    res.status(200).json({
      otp,
      message: `An mail has been sent to ${email}`,
    });
  }

  async generateRefreshToken(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.first_link_exim_token)
      return next(new ErrorHandler("Unauthorized", 401));
    const refreshToken = cookies.first_link_exim_token;
    const decoded = await tokenService.verifyRefreshToken(refreshToken);

    if (typeof decoded === "string")
      return next(new ErrorHandler("Unauthorized", 401));
    const customer = await customerService.findById(decoded.id);
    if (!customer) return next(new ErrorHandler("Unauthorized", 401));

    const { access_token } = await tokenService.generateToken({
      id: customer._id,
    });

    res.status(200).json({
      access_token,
      customer,
    });
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));

    const customer = await customerService.findByEmail(email);
    if (!customer) return next(new ErrorHandler("User does not exist", 404));
  }

  async logout(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.first_link_exim_token)
      return next(new ErrorHandler("No content", 204));

    res.clearCookie("first_link_exim_token", {
      httpOnly: true,
    });
    logger.info("Logout successfully done.");
    res.status(200).json({ message: "Logout successfully done." });
  }

  async customerProfile(req, res, next) {
    const userId = req.user;
    const customer = await customerService.findById(userId);
    res.status(200).json(customer);
  }


  async addToWishlist(req, res, next) {
    const customerId = req.user
    
    if (!customerId) {
      return next(new ErrorHandler("Customer not found", 404));
    }
    
    const product = await productService.addToWishlist(req.body, customerId);
    res.status(200).json("Wishlist");
  }

  async removeFromWishlist(req, res, next) {}

  async getWishlist(req, res, next) {}

  async addToCart(req, res, next) {}

  async removeFromCart(req, res, next) {}

  async getCart(req, res, next) {}

  async checkout(req, res, next) {}
}

export const customerController = new CustomerController();
