import express from "express";
const router = express.Router();

import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  getOwnerRestaurants,
  getAllRestaurants,
  searchRestaurants,
  deleteRestaurant
} from "../Controllers/restaurantController.js";

import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { isOwner } from "../Middlewares/roleMiddleware.js";
import upload  from "../Middlewares/uploadMiddleware.js";


// Owner Routes
router.post(
  "/create",
  authMiddleware,
  upload.array("photos", 5),
  isOwner,
  createRestaurant
);

router.get("/owner", authMiddleware, isOwner, getOwnerRestaurants);

router.put(
  "/update/:id", 
  authMiddleware, 
  isOwner, 
  upload.array("photos", 5), 
  updateRestaurant
);

router.delete("/delete/:id", authMiddleware, isOwner, deleteRestaurant);


// User Routes
router.get("/", getAllRestaurants);        // show all restaurants

router.get("/search", searchRestaurants);  // search restaurants

router.get("/:id", getRestaurant);         // single restaurant


export default router;