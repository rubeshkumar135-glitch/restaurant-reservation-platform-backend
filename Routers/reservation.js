import express from "express";
 const router = express.Router();
 
import  {  createReservation, getUserReservations, updateReservation, cancelReservation, checkAvailability } from "../Controllers/reservationController.js";
import { isUser } from "../Middlewares/roleMiddleware.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

router.post("/create", authMiddleware, isUser, createReservation);

 router.get("/my", authMiddleware, isUser, getUserReservations);

 router.put("/update/:id", authMiddleware, isUser, updateReservation);

 router.delete("/cancel/:id", authMiddleware, isUser, cancelReservation);

 router.get("/availability", checkAvailability);

 export default router;