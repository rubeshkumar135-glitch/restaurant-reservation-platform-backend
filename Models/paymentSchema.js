import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation"
  },
  amount: Number,
  paymentStatus: {
    type: String,
    default: "pending"
  },
  stripeSessionId: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);