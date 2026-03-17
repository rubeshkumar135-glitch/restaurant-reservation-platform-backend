import express from "express";
import { createCheckOutSession } from "../Controllers/paymentController.js";

const router = express.Router();

// Create a checkout session for payment
router.post("/checkout", createCheckOutSession);

export default router;