import express from "express";
const router = express.Router();

import { getDashboardStatus, getAllRestaurants, deleteRestaurant, getAllReviews, deleteReview, getAllReservations, getAllUsers, } from "../Controllers/adminController.js"; 
import { isAdmin } from "../Middlewares/roleMiddleware.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

router.get("/dashboardstatus", authMiddleware, isAdmin, getDashboardStatus);
router.get("/allrestaurants", authMiddleware, isAdmin, getAllRestaurants);
router.get("/allreviews", authMiddleware, isAdmin, getAllReviews);
router.get("/allreservations", authMiddleware, isAdmin, getAllReservations);
router.get("/allusers", authMiddleware, isAdmin, getAllUsers);
router.delete("/deleterestaurant/:id", authMiddleware, isAdmin, deleteRestaurant);
router.delete("/deletereview/:id", authMiddleware, isAdmin, deleteReview);


export default router;