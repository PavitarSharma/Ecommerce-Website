import { Order } from "../models/order.model.js";
import { customerService } from "./customer.service.js"

class OrderService {
    async createOrder(customerId,body) {
        const customer = await customerService.findById(customerId)
        if (!customer) {
            throw new ErrorHandler("User does not exist", 404);
        }
        const orderId = `${Math.floor(Math.random() * 89999)+ 1000}`;
    

        const orderData = {
            ...body,
            orderId
        }

        const order = await Order.create(orderData)
        customer.carts = []
        customer.orders.push(order)
        await customer.save()
        return order

    }

    async getAllOrders(query) {
        const orders = await Order.find(query)
        return orders
    }

    async getOrder(orderId) {
        const order = await Order.findById(orderId)
        return order
    }
}

export const orderService = new OrderService()