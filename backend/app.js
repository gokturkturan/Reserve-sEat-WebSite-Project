import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import restaurantRoutes from "./routes/restaurant.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/reservation.js";
import uploadFile from "./routes/uploadFile.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", orderRoutes);
app.use("/api/upload", uploadFile);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
