import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },

  contact: {
    phone: String,
    email: String
  },

  cuisineTypes: [String],

  priceRange: {
    type: String,
    enum: ["low", "medium", "high"]
  },

  photos: [String],

  hoursOfOperation: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },

  // ⭐ IMPORTANT CHANGE
  averageRating: {
    type: Number,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  capacity: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);