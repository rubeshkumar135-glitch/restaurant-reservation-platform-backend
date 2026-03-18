import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
const router = express.Router();


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user); // 👈 DEBUG

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err); // 👈 IMPORTANT
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;