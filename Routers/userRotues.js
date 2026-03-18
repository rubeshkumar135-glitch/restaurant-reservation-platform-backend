import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    res.json(req.user); // ✅ FIX
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;