import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config();
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      profilePhotoUrl: { type: String },
      public_id: { type: String },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    parkings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parking",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.setProfilePhoto = async function (
  profilePhotoUrl,
  public_id
) {
  this.profilePhoto = { profilePhotoUrl, public_id };
  await this.save();
};

export const User = mongoose.model("User", userSchema);
