import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/dbConfig.js";
import cors from "cors";

import auth from "./Routers/auth.js";
import restaurants from "./Routers/restaurant.js";
import reviews from "./Routers/review.js";
import reservations from "./Routers/reservation.js";
import admin from "./Routers/admin.js";

import payment from "./Routers/payment.js";
import users from "./Routers/userRotues.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", auth);
app.use("/api/restaurants", restaurants);
app.use("/api/reservations", reservations);
app.use("/api/reviews", reviews);
app.use("/api/admin", admin);
app.use("/api/payment", payment);
app.use("/api/users", users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Is Runnig On This PORT ${PORT}`);
});
