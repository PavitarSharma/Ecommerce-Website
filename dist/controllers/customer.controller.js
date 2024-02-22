"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const utils_1 = require("../utils");
const services_1 = require("../services");
class CustomerController {
    /**
     * @construct Registers a customer
     * @routes /api/customers/register
     * @body { name: string, email: string, password: string, confirmPassword: string}
     */
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, confirmPassword } = req.body;
            if (!name)
                return next(new utils_1.ErrorHandler("Name is required", 400));
            if (!email)
                return next(new utils_1.ErrorHandler("Email is required", 400));
            if (!password)
                return next(new utils_1.ErrorHandler("Password is required", 400));
            if (!confirmPassword)
                return next(new utils_1.ErrorHandler("Confirm password is required", 400));
            if (password !== confirmPassword)
                return next(new utils_1.ErrorHandler("Passwords do not match", 400));
            // Check Email alreday be registered
            // const existCustomer = await customerService.findByEmail(email);
            // if (existCustomer)
            //   return next(new ErrorHandler("Email is already registered", 400));
            // const customer = await customerService.register(req.body)
            const otp = yield services_1.otpService.generateOtp();
            const ttl = 1000 * 60 * 15;
            const expires = Date.now() + ttl;
            const data = `${{ a: 1, b: 1, c: 1 }}.${otp}.${expires}`;
            const hash = services_1.hashService.hashOtp(data);
            res.status(201).json({
                hash: `${hash}.${expires}`,
                otp
            });
        });
    }
}
exports.customerController = new CustomerController();
//# sourceMappingURL=customer.controller.js.map