import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import JWT from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("authorization")?.replace("Bearer ", "");

  if (!accessToken) throw new ApiError(401, "Unauthorized");

  try {
    const decodedToken = JWT.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select(
      " -password -refreshToken"
    );

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
