import express from "express";
const router = express.Router();

import { createReview, getRestaurantReviews, updateReview, deleteReview, ownerResponse} from "../Controllers/reviewController.js";
import { isOwner, isUser } from "../Middlewares/roleMiddleware.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import upload from "../Middlewares/uploadMiddleware.js";

// router.post("/create", authMiddleware, isUser, createReview);
router.post(
  "/create",
  authMiddleware,
  isUser,
  upload.single("photos"),
  createReview
);

router.get("/restaurant/:restaurantId", getRestaurantReviews);

// router.put("/update/:id", authMiddleware, isUser, updateReview);
router.put(
  "/update/:id",
  authMiddleware,
  isUser,
  upload.single("photos"), // ✅ IMPORTANT
  updateReview
);

router.delete("/delete/:id", authMiddleware, isUser, deleteReview);

router.put("/owner-response/:reviewId", authMiddleware, isOwner, ownerResponse);

export default router;