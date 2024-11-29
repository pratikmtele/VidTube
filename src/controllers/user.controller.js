import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploaOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser)
    throw new ApiError(409, "User with username or email is already exists");

  // access to file
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");
  const avatar = await uploaOnCloudinary(avatarLocalPath, "avatar");

  let coverImageUrl;
  if (coverLocalPath) {
    coverImageUrl = await uploaOnCloudinary(coverLocalPath, "coverImage");
  }

  try {
    const newUser = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImageUrl?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findOne({ _id: newUser._id }).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      throw new ApiError(500, "Something went wrong while registering a user");

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User created successfully"));
  } catch (error) {
    // deleting images from cloudinary
    if (avatar) {
      deleteOnCloudinary(avatar.public_id);
    }
    if (coverImageUrl) {
      deleteOnCloudinary(coverImageUrl.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted from cloudinary"
    );
  }
});

export { registerUser };
