import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import User from "../"

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

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const { name, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;