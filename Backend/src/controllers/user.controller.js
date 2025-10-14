import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  let profilePhotoLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.profilePhoto) &&
    req.files.profilePhoto.length > 0
  ) {
    profilePhotoLocalPath = req.files.profilePhoto[0].path;
  }
  const profilePhoto = await uploadOnCloudinary(
    profilePhotoLocalPath,
    "Parking-app/ProfilePhoto"
  );

  const user = new User({
    fullName,
    email,
    password,
    userName,
  });

  await user.setProfilePhoto(profilePhoto?.secure_url, profilePhoto?.public_id);

  await user.save();

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "userName or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const session = new Session({
    user: user._id,
    refreshToken: "",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const refreshToken = generateRefreshToken(user._id, session._id);
  const accessToken = generateAccessToken(user._id, session._id);

  session.refreshToken = refreshToken;
  await session.save();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required", [
      "Refresh token is required",
    ]);
  }
  await Session.findOneAndDelete({ refreshToken: incomingRefreshToken });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    throw new ApiError(401, "Unauthorized request", ["Unauthorized request"]);
  }

  const decodeToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const session = await Session.findOne({
    _id: decodeToken.sessionId,
    refreshToken: incomingRefreshToken,
  }).select("-refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  if (!session) {
    res
      .status(401)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options);
    throw new ApiError(401, "Invalid session", ["Invalid session"]);
  }

  if (session.expiresAt < new Date()) {
    await Session.findByIdAndDelete(session._id);

    res
      .status(401)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options);
    throw new ApiError(401, "Session Expired. Please login again", [
      "Session Expired. Please login again",
    ]);
  }

  const accessToken = generateAccessToken(session.user._id, session._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    })
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName: fullName ? fullName : req.user.fullName } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserProfilePhoto = asyncHandler(async (req, res) => {
  let oldUserProfilePhoto = req.user.profilePhoto;

  const profilePhotoLocalPath = req.file?.path;

  if (!profilePhotoLocalPath) {
    throw new ApiError(400, "Profile Photo is missing");
  }
  const profilePhoto = await uploadOnCloudinary(
    profilePhotoLocalPath,
    "Parking-app/ProfilePhoto"
  );

  let userProfilePhoto = {
    profilePhotoUrl: profilePhoto?.secure_url,
    public_id: profilePhoto?.public_id,
  };

  if (!profilePhoto.secure_url) {
    throw new ApiError(400, "Error while uploading profile photo");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { profilePhoto: userProfilePhoto } },
    { new: true }
  ).select("-password");

  await deleteFromCloudinary(oldUserProfilePhoto.public_id);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile photo successfully updated"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserProfilePhoto,
};
