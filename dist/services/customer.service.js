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
exports.customerService = void 0;
const config_1 = require("../config");
const models_1 = require("../models");
class CustomerService {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Customer.findById(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Customer.findOne({ email });
        });
    }
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Customer.findOne({ phone });
        });
    }
    updateLoginDevices(customer, device) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingDeviceIndex = customer.loginDevices.findIndex((loginDevice) => loginDevice.device === device);
                if (existingDeviceIndex !== -1) {
                    // If the device already exists in the array, increment its count
                    customer.loginDevices[existingDeviceIndex].count += 1;
                    config_1.logger.info(`Device '${device}' count incremented`);
                }
                else {
                    // If the device is new, add it to the array
                    customer.loginDevices.push({ device, count: 1 });
                    config_1.logger.info(`Device '${device}' added to loginDevices`);
                }
                config_1.logger.info("Updated customer:", customer);
                return customer;
            }
            catch (error) {
                config_1.logger.error("Error updating login devices:", error.message);
                return null;
            }
        });
    }
    deleteSingleDevice(deleteDeviceInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, device } = deleteDeviceInput;
            try {
                const customer = yield models_1.Customer.findOne({ email }); // Find the customer by email
                if (!customer) {
                    throw new Error("Customer not found");
                }
                // Find the index of the device in the loginDevices array
                const deviceIndex = customer.loginDevices.findIndex((loginDevice) => loginDevice.device === device);
                if (deviceIndex !== -1) {
                    // If the device exists, remove it from the array
                    customer.loginDevices.splice(deviceIndex, 1);
                    yield customer.save(); // Save the updated customer document
                    config_1.logger.info(`Device '${device}' removed successfully`);
                }
                else {
                    config_1.logger.info(`Device '${device}' not found`);
                }
            }
            catch (error) {
                config_1.logger.error("Error deleting device:", error.message);
                throw error; // Propagate the error for handling in the caller
            }
        });
    }
    deleteAllDevices(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield models_1.Customer.findOne({ email }); // Find the customer by email
                if (!customer) {
                    throw new Error("Customer not found");
                }
                // Clear the loginDevices array
                customer.loginDevices = [];
                yield customer.save(); // Save the updated customer document
                config_1.logger.info("All devices removed successfully");
            }
            catch (error) {
                config_1.logger.error("Error deleting all devices:", error.message);
                throw error; // Propagate the error for handling in the caller
            }
        });
    }
    register(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Customer.create(customer);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Customer.findOne({ email, password });
        });
    }
}
exports.customerService = new CustomerService();
//# sourceMappingURL=customer.service.js.map