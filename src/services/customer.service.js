
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.model.js";
import { logger } from "../config/logger.js";
import { ACTIVATION_SECRET } from "../config/environment.js";

class CustomerService {
  async findById(id) {
    return await Customer.findById(id);
  }

  async findByEmail(email) {
    return await Customer.findOne({ email });
  }

  async updateLoginDevices(customer, device) {
    try {
      const existingDeviceIndex = customer.loginDevices.findIndex(
        (loginDevice) => loginDevice.device === device
      );

      if (existingDeviceIndex !== -1) {
        customer.loginDevices[existingDeviceIndex].count += 1;
        logger.info(`Device '${device}' count incremented`);
      } else {
        customer.loginDevices.push({ device, count: 1 });
        logger.info(`Device '${device}' added to loginDevices`);
      }

      logger.info("Updated customer:", customer);
      return customer;
    } catch (error) {
      logger.error("Error updating login devices:", error.message);
      return null;
    }
  }

  async deleteSingleDevice(deleteDeviceInput) {
    const { email, device } = deleteDeviceInput;

    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        throw new Error("Customer not found");
      }

      const deviceIndex = customer.loginDevices.findIndex(
        (loginDevice) => loginDevice.device === device
      );
      if (deviceIndex !== -1) {
        customer.loginDevices.splice(deviceIndex, 1);
        await customer.save();
        logger.info(`Device '${device}' removed successfully`);
      } else {
        logger.info(`Device '${device}' not found`);
      }
    } catch (error) {
      logger.error("Error deleting device:", error.message);
      throw error;
    }
  }

  async deleteAllDevices(email) {
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        throw new Error("Customer not found");
      }

      customer.loginDevices = [];
      await customer.save();
      logger.info("All devices removed successfully");
    } catch (error) {
      logger.error("Error deleting all devices:", error.message);
      throw error;
    }
  }

  async generateUsername(email) {
    let username = email.split("@")[0];

    const isUsernameNotUnique = await Customer.findOne({ username });

    isUsernameNotUnique ? (username += uuidv4().substring(0, 5)) : "";

    return username;
  }

  async generateVerificationToken(id, email) {
    return jwt.sign({ id, email }, ACTIVATION_SECRET, {
      expiresIn: "10m",
    });
  }

  async accountVerified(token) {
    return jwt.verify(token, ACTIVATION_SECRET);
  }

  async register(customer) {
    const username = await this.generateUsername(customer.email);
    const data = {
      ...customer,
      username,
    };

    return await Customer.create(data);
  }

  async login(email, password) {
    return await Customer.findOne({ email, password });
  }
}

export const customerService = new CustomerService();
