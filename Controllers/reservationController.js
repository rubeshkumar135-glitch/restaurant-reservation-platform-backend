import ReservationSchema from "../Models/reservationSchema.js";
import RestaurantSchema from "../Models/restaurantSchema.js";

// Create Reservation
export const createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, partySize } = req.body;

    // Check if restaurant exists
    const restaurant = await RestaurantSchema.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ Message: "Restaurant not found" });
    }

    // Check existing reservation for same time
    const existingReservation = await ReservationSchema.find({
      restaurant: restaurantId,
      date,
      time,
    });

    // Calculate reserved seats
    const reservedSeats = existingReservation.reduce(
      (total, r) => total + r.partySize,
      0,
    );

    // Ckeck availability
    if (reservedSeats + partySize > restaurant.capacity) {
      return res
        .status(400)
        .json({ message: "No availability for selected time" });
    }

    // Create Reservation
    const reservation = await ReservationSchema.create({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      time,
      partySize,
      status: "booked",
    });

    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Reservations
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await ReservationSchema.find({
      user: req.user.id,
    }).populate({
      path: "restaurant",
      model: "Restaurant",
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Reservation
export const updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await ReservationSchema.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only user can update their reservation
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { date, time, partySize } = req.body;

    reservation.date = date || reservation.date;
    reservation.time = time || reservation.time;
    reservation.partySize = partySize || reservation.partySize;

    await reservation.save();

    res
      .status(201)
      .json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Reservation
export const cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await ReservationSchema.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

import mongoose from "mongoose";

export const checkAvailability = async (req, res) => {
  try {
    const { restaurantId, date, time } = req.query;

    // Validate inputs
    if (!restaurantId || !date || !time) {
      return res.status(400).json({
        message: "restaurantId, date and time are required",
      });
    }

    // Validate ObjectId (prevents CastError)
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        message: "Invalid restaurant ID",
      });
    }

    // Find restaurant
    const restaurant = await RestaurantSchema.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // Find reservations
    const reservations = await ReservationSchema.find({
      restaurant: restaurantId,
      date,
      time,
      status: "booked",
    });

    // Calculate reserved seats
    const reservedSeats = reservations.reduce(
      (total, r) => total + Number(r.partySize || 0),
      0,
    );

    // Ensure capacity exists
    const capacity = restaurant.capacity || 50;

    const availableSeats = capacity - reservedSeats;

    res.status(200).json({
      availableSeats: availableSeats > 0 ? availableSeats : 0,
      isAvailable: availableSeats > 0,
    });
  } catch (error) {
    console.error("Availability Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
