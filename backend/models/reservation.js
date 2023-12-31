import mongoose from "mongoose";

const reservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    reservationDate: { type: String, required: true },
    reservationTime: { type: String, required: true },
    note: { type: String },
    isApproved: {
      type: String,
      required: true,
      default: "Pending",
    },
    ApprovedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
