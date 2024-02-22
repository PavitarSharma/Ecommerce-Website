import { logger } from "../config";
import { Customer, CustomerDoc } from "../models";
import { RegisterCustomer, VerifyEmail } from "../types";
import { v4 as uuidv4 } from "uuid"

interface DeleteDeviceInput {
  email: string;
  device: string;
}

class CustomerService {
  async findById(id: string): Promise<CustomerDoc | null> {
    return await Customer.findById(id);
  }

  async findByEmail(email: string): Promise<CustomerDoc | null> {
    return await Customer.findOne({ email });
  }

  async findByPhone(phone: string): Promise<CustomerDoc | null> {
    return await Customer.findOne({ phone });
  }

  async updateLoginDevices(
    customer: CustomerDoc,
    device: string
  ): Promise<CustomerDoc | null> {
    try {
      const existingDeviceIndex = customer.loginDevices.findIndex(
        (loginDevice) => loginDevice.device === device
      );

      if (existingDeviceIndex !== -1) {
        // If the device already exists in the array, increment its count
        customer.loginDevices[existingDeviceIndex].count += 1;
        logger.info(`Device '${device}' count incremented`);
      } else {
        // If the device is new, add it to the array
        customer.loginDevices.push({ device, count: 1 });
        logger.info(`Device '${device}' added to loginDevices`);
      }

      logger.info("Updated customer:", customer);
      return customer;
    } catch (error: any) {
      logger.error("Error updating login devices:", error.message);
      return null;
    }
  }

  async deleteSingleDevice(
    deleteDeviceInput: DeleteDeviceInput
  ): Promise<void> {
    const { email, device } = deleteDeviceInput;

    try {
      const customer = await Customer.findOne({ email }); // Find the customer by email
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Find the index of the device in the loginDevices array
      const deviceIndex = customer.loginDevices.findIndex(
        (loginDevice) => loginDevice.device === device
      );
      if (deviceIndex !== -1) {
        // If the device exists, remove it from the array
        customer.loginDevices.splice(deviceIndex, 1);
        await customer.save(); // Save the updated customer document
        logger.info(`Device '${device}' removed successfully`);
      } else {
        logger.info(`Device '${device}' not found`);
      }
    } catch (error: any) {
      logger.error("Error deleting device:", error.message);
      throw error; // Propagate the error for handling in the caller
    }
  }

  async deleteAllDevices(email: string): Promise<void> {
    try {
      const customer = await Customer.findOne({ email }); // Find the customer by email
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Clear the loginDevices array
      customer.loginDevices = [];
      await customer.save(); // Save the updated customer document
      logger.info("All devices removed successfully");
    } catch (error: any) {
      logger.error("Error deleting all devices:", error.message);
      throw error; // Propagate the error for handling in the caller
    }
  }

  async generateUsername(email: string) {
    let username = email.split("@")[0];

    const isUsernameNotUnique = await Customer.findOne({ username: username });

    isUsernameNotUnique ? (username += uuidv4().substring(0, 5)) : "";

    return username;
  }

  async register(customer: RegisterCustomer): Promise<CustomerDoc> {
    const username = await this.generateUsername(customer.email)
    const data = {
      ...customer,
      username
    }
    
    return await Customer.create(data);
  }



  async login(email: string, password: string): Promise<CustomerDoc | null> {
    return await Customer.findOne({ email, password });
  }
}

export const customerService = new CustomerService();
