import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    date: {
        type: Date,
        required: [true, "Reservation date is required!"]
    },
    time: {
        type: String,
        required: [true, "Reservation time is required!"]
    },
    partySize: {
        type: Number,
        required: [true, "PartySize is required!"]
    },
    status: {
        type: String,
        enum: ["booked", "cancelled"],
        default: "booked"
    },
}, {timestamps: true} );

export default mongoose.model("Reservation", reservationSchema);
