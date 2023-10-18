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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    reservationDate: { type: Date, required: true },
    reservationTime: { type: String, required: true },
    note: { type: String },
    isApproved: {
      type: Boolean,
      required: true,
      default: false,
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
