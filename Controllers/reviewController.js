import mongoose from "mongoose";
import Review from "../Models/userReviewSchema.js";
import Reservation from "../Models/reservationSchema.js";
import Restaurant from "../Models/restaurantSchema.js";

export const createReview = async (req, res) => {
  try {
    console.log("Full Header:", req.headers["content-type"]);
    console.log("Raw Body:", req.body);

    const restaurantId = req.body?.restaurantId;
    const rating = Number(req.body?.rating); // ✅ ensure number
    const comment = req.body?.comment;

    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const photoUrls = req.file ? [req.file.path] : [];

    const reservation = await Reservation.findOne({
      user: new mongoose.Types.ObjectId(req.user.id),
      restaurant: new mongoose.Types.ObjectId(restaurantId),
    });

    if (!reservation) {
      return res.status(400).json({
        message: "You must reserve before reviewing",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant: restaurantId,
      rating,
      comment,
      photos: photoUrls,
    });

    await updateRestaurantRating(restaurantId);

    const reviews = await Review.find({ restaurant: restaurantId });

    const total = reviews.length;

    const avg =
      total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
      averageRating: Number(avg.toFixed(1)),
      totalReviews: total,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Restaurant Reviews
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
    })
      .populate("user", "name")
      .populate("restaurant", "owner");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rating = req.body?.rating;
    const comment = req.body?.comment;

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    if (req.file) {
      review.photos = [req.file.path];
    }

    await review.save();

    await updateRestaurantRating(review.restaurant);

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurantRating = async (restaurantId) => {
  const reviews = await Review.find({ restaurant: restaurantId });

  const total = reviews.length;

  const avg =
    total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    averageRating: Number(avg.toFixed(1)),
    totalReviews: total,
  });
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const restaurantId = review.restaurant;

    await review.deleteOne();

    await updateRestaurantRating(restaurantId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Owner respond to review

export const ownerResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { message } = req.body;

    const review = await Review.findById(reviewId).populate("restaurant");

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only owner can reply",
      });
    }

    review.ownerResponse = {
      message,
      respondedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      message: "Reply added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
