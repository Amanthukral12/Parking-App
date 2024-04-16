import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    longitude: {
      type: String,
      trim: true,
    },
    latitude: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    note: {
      type: String,
    },
    basementLevel: {
      type: String,
    },
    pillarNumber: {
      type: String,
    },
    parkingSlip: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Parking = mongoose.model("Parking", parkingSchema);
