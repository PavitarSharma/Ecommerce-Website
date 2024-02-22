import { NextFunction, Request, Response } from "express";
import { ErrorHandler, sendMail } from "../utils";
import {
  customerService,
  hashService,
  mailService,
  otpService,
  tokenService,
} from "../services";
import jwt from "jsonwebtoken";
import { logger } from "../config";

class CustomerController {
  /**
   * @construct Registers a customer
   * @routes /api/customers/register
   * @body { name: string, email: string, password: string, confirmPassword: string}
   */
  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, confirmPassword } = req.body;
    if (!name) return next(new ErrorHandler("Name is required", 400));
    if (!email) return next(new ErrorHandler("Email is required", 400));
    if (!password) return next(new ErrorHandler("Password is required", 400));
    if (!confirmPassword)
      return next(new ErrorHandler("Confirm password is required", 400));
    if (password !== confirmPassword)
      return next(new ErrorHandler("Passwords do not match", 400));

    // Check Email alreday be registered
    const existingCustomer = await customerService.findByEmail(email);
    if (existingCustomer) {
      if (existingCustomer.verified) {
        return next(new ErrorHandler("Email is already registered", 400));
      } else {
        return next(
          new ErrorHandler("Email is already registered but not verified", 400)
        );
      }
    }

    await customerService.register(req.body);
    const otp = await otpService.generateOtp();
    const otpExpiration = new Date(Date.now() + 1000 * 60 * 10);
    await otpService.saveOtp(email, otp, otpExpiration);
    await mailService.verificationMail(
      { ...req.body, otp },
      "activation-account-mail"
    );
    res.status(201).json({
      email,
      message: `An activation mail has been sent to ${email}`,
    });
  }

  /**
   * @construct Verify customer mail
   * @routes /api/customers/verify
   * @body { otp: number, hash: string }
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { otp, email } = req.body;

    if (!otp) return next(new ErrorHandler("Otp is required", 400));
    if (!email) return next(new ErrorHandler("Email is required", 400));

    const isOtpValid = await otpService.isOtpInvalid(email, otp);
    if (!isOtpValid) return next(new ErrorHandler("OTP is invalid", 400));

    const isOtpExpired = await otpService.isOtpExpired(email, otp);
    if (isOtpExpired) return next(new ErrorHandler("OTP is expired", 400));

    const customer = await customerService.findByEmail(email);
    if (!customer) return next(new ErrorHandler("User does not exist", 404));

    await otpService.otpHasVerified(email);
    customer.verified = true;
    await customer.save();
    logger.info("User verified email");

    const { access_token, refresh_token } = await tokenService.generateToken({
      id: customer._id,
    });
    res.cookie("first_link_exim_token", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ access_token, message: "User verified" });
  }

  /**
   * @construct Custime login
   * @routes /api/customers/login
   * @body { email: string; password: string; device: string }
   */
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password, device } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));
    if (!password) return next(new ErrorHandler("Password is required", 400));
    const customer = await customerService.findByEmail(email);
    if (!customer)
      return next(new ErrorHandler("Invalid email or password", 400));

    if (!customer.verified)
      return next(new ErrorHandler("User not verified", 400));

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

  /**
   * @construct Resend verification mail
   * @routes /api/customers/resend-verification
   * @body { email: string;  }
   */
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));
    const customer = await customerService.findByEmail(email);
    if (!customer) return next(new ErrorHandler("User does not exist", 404));

    const prevOtp = await otpService.findOtpByEmail(email);
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    const newOtp = await otpService.generateOtp();

    const otp = await otpService.updateOtp(email, newOtp, expirationTime);

    await mailService.verificationMail({ ...req.body, otp }, "resend-otp-mail");
    logger.info("Resend verification email");
    res.status(200).json({
      otp,
      message: `An mail has been sent to ${email}`,
    });
  }

  /**
   * @construct Generates a refresh token
   * @routes /api/customers/refresh
   */
  async generateRefreshToken(req: Request, res: Response, next: NextFunction) {
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

  /**
   * @construct Forgot Password
   * @routes /api/customers/forgot-password
   * @body { email: string; }
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) return next(new ErrorHandler("Email is required", 400));

    const customer = await customerService.findByEmail(email);
    if (!customer) return next(new ErrorHandler("User does not exist", 404));
  }

  /**
   * @construct Logout from website
   * @routes /api/customers/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    if (!cookies.first_link_exim_token)
      return next(new ErrorHandler("No content", 204));

    res.clearCookie("first_link_exim_token", {
      httpOnly: true,
    });

    res.status(200).json({ message: "Logout successfully done." });
  }

  async customerProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user;
    const customer = await customerService.findById(userId as string);
    res.status(200).json(customer);
  }
}

export const customerController = new CustomerController();
