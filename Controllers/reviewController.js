import Review from "../Models/userReviewSchema.js";
import Reservation from "../Models/reservationSchema.js";

// Create Review
import mongoose from "mongoose";

export const createReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment, photos } = req.body;

        const reservation = await Reservation.findOne({
            user: new mongoose.Types.ObjectId(req.user.id),
            restaurant: new mongoose.Types.ObjectId(restaurantId),
            status: "booked"
        });

        if (!reservation) {
            return res.status(400).json({
                message: "You can only review restaurant you visited"
            });
        }

        const review = await Review.create({
            user: req.user.id,
            restaurant: restaurantId,
            rating,
            comment,
            photos
        });

        res.status(201).json({
            message: "Review added successfully",
            review
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Restaurant Reviews
export const getRestaurantReviews =  async (req, res) => {
    try {
        const reviews = await Review.find({restaurant: req.params.restaurantId}).populate("user", "name");
        res.status(201).json(reviews);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Edit Review
export const updateReview = async (req,res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({message: "Review not found"});
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({message: "Unauthorized"});
        }

        const { rating, comment, photos } = req.body;

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.photos = photos || review.photos;

        await review.save();

        res.status(201).json({message: "Review updated successfully",review});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Delete Review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).josn({message: "Unauthorized"});
        }

        await review.deleteOne();

        res.status(201).json({message: "Review deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Owner respond to review
export const ownerResponse = async (req, res) => {
    try {

        const { reviewId } = req.params;
        const { message } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        review.ownerResponse = {
            message: message,
            respondedAt: new Date()
        };

        await review.save();

        res.status(200).json({
            message: "Owner responded successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};