import Restaurant from "../Models/restaurantSchema.js";
import Review from "../Models/userReviewSchema.js";
import Reservation from "../Models/reservationSchema.js";
import User from "../Models/userSchema.js";


// Get Dashboard Statistics
export const getDashboardStatus = async (req, res) => {
  try {

    const restaurants = await Restaurant.countDocuments();
    const reviews = await Review.countDocuments();
    const reservations = await Reservation.countDocuments();
    const users = await User.countDocuments();

    res.json({
      restaurants,
      reviews,
      reservations,
      users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Restaurants
export const getAllRestaurants = async (req, res) => {
  try {

    const restaurants = await Restaurant.find()
      .populate("owner", "name email");

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Delete Restaurant
export const deleteRestaurant = async (req, res) => {
  try {

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({
      message: "Restaurant deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Reviews
export const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("user", "name")
      .populate("restaurant", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Delete Review
export const deleteReview = async (req, res) => {
  try {

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review removed by admin"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Reservations
export const getAllReservations = async (req, res) => {
  try {

    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("restaurant", "name");

    res.json(reservations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Users
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};