import mongoose from "mongoose";
import { User } from "./user.model.js";

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
        parkingSlipUrl: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

parkingSchema.post("save", async function (doc) {
  const user = await User.findById(doc.owner);
  if (user) {
    user.parkings.push(doc._id);
    await user.save();
  }
});

export const Parking = mongoose.model("Parking", parkingSchema);
