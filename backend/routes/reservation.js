import express from "express";
import reservationController from "../controllers/reservation.js";
import { isAuth, isRestaurant } from "../middleware/authHandler.js";
const router = express.Router();

router.post("/makeReservation", isAuth, reservationController.makeReservation);
router.get(
  "/myReservations",
  isAuth,
  reservationController.getUserReservations
);
// router.get(
//   "/restaurantReservations",
//   isRestaurant,
//   reservationController.getRestaurantReservations
// );
// router.put(
//   "/:id/approveOrDecline",
//   isRestaurant,
//   reservationController.updateReservationStatus
// );

export default router;
