import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const generateAccessToken = (userId, sessionId) => {
  return jwt.sign({ userId, sessionId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign({ userId, sessionId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
