import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
const router = express.Router();


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await user.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;