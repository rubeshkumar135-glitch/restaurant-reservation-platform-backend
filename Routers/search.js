import express from "express";
const router = express.Router();

import  { searchRestaurants } from "../Controllers/searchController.js";

router.get("/restaurants/search", searchRestaurants);

export default router;