

import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckOutSession = async (req, res) => {
  try {

    const { reservationId, price } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Restaurant Reservation"
            },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],

      mode: "payment",

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel"
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
