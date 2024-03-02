import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/environment.js';


const stripe = new Stripe(STRIPE_SECRET_KEY);

class PaymentController {
    async createPaymentIntent(req, res) {
     
        try {
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount * 100,
                currency: req.body.currency,
            });
            res.status(201).json(paymentIntent);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export const paymentController = new PaymentController()