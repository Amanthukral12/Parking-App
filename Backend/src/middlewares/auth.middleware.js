import Session from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(
        new ApiError(401, "Unauthorized. Please try again", [
          "Unauthorized. Please try again",
        ])
      );
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const session = await Session.findById(decodeToken?.sessionId).select(
      "-refreshToken"
    );
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await Session.findByIdAndDelete(session._id);
      }
      throw new ApiError(401, "Invalid or expired session", [
        "Invalid or expired session",
      ]);
    }
    req.user = session.user.toString();
    req.session = session;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
