// routes/userRoutes.js

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await user.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});