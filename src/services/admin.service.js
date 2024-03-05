import { Customer } from "../models/customer.model.js";
import { customerService } from "./customer.service.js";

class AdminService {
  async getAllUsers(params) {
    const {  q } = params;
    const page = Number(params.page) || 1
    const limit = Number(params.limit) || 10
    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: new RegExp(q, "i") } },
        { email: { $regex: new RegExp(q, "i") } },
        { phone: { $regex: new RegExp(q, "i") } },
      ];
    }

    const totalCount = await Customer.countDocuments(query);

    const users = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return { users, totalPages, totalCount };
  }

  async updateUserRole(body) {
    const user = await Customer.findById(body.id);
    user.role = body.role;
    return await user.save();
  }

  async deleteUser(userId) {
    const user = await Customer.findByIdAndDelete(userId);
    return user;
  }

  async createUser(body) {
    const username = await customerService.generateUsername(body.email);

    const data = {
      ...body,
      username,
    };
    return await Customer.create(data);
  }
}

export const adminService = new AdminService();
