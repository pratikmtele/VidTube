import { asyncHandler } from "../utils/asyncHandler.js";
import { Videos } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploaOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration, isPublished } = req.body;

  if ([title, description, duration].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required");

  const videoLocalpath = req.files?.video?.[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail?.[0].path;

  if (!videoLocalpath) throw new ApiError(404, "Video file is missing");
  if (!thumbnailLocalpath) throw new ApiError(404, "thumbnail file is missing");

  const video = await uploaOnCloudinary(videoLocalpath, "video");
  const thumbnail = await uploaOnCloudinary(thumbnailLocalpath, "thumbnail");

  if (!video?.url) throw new ApiError(401, "Video url is missing");

  if (!thumbnail?.url) throw new ApiError(401, "Thumbail url is missing");

  try {
    const newVideo = await Videos.create({
      videoFile: video.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration,
      isPublished,
      owner: req.user._id,
    });

    const createdVideo = await Videos.findById({ _id: newVideo._id }).select(
      "-views -isPublished"
    );

    if (!createdVideo)
      throw new ApiError(
        500,
        "Something went wrong while creating video document"
      );

    return res
      .status(200)
      .json(new ApiResponse(200, newVideo, "Video uploaded successfully"));
  } catch (error) {
    if (video.url) {
      await deleteOnCloudinary(video.public_id);
    }

    if (thumbnail.url) {
      await deleteOnCloudinary(thumbnail.public_id);
    }

    console.log(error);

    throw new ApiError(
      401,
      "Something went wrong while uploading video or thumbnail",
      error
    );
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, isPublished } = req.body;

  if ([title, description, duration].some((field) => field.trim() === ""))
    throw new ApiError(400, "All fields are required");

  const thumbnailLocalpath = req.file?.path;

  try {
    if (!thumbnailLocalpath) throw new ApiError(400, "Thumbnail is missing");

    const thumbnail = await uploaOnCloudinary(thumbnailLocalpath, "thumbnail");

    if (!thumbnail.url) throw new ApiError(401, "Thumbnail url is missing");

    const updatedVideo = await Videos.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          duration,
          isPublished,
          thumbnail: thumbnail.url,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    if (thumbnail.url) {
      await deleteOnCloudinary(thumbnailLocalpath, "thumbnail");
    }

    throw new ApiError(
      500,
      "Something went wrong while updating video details"
    );
  }
});

const getAllVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const videos = await Videos.find({ owner: userId });

  if (!videos.length) throw new ApiError(404, "videos are not found");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully."));
});

const getVideosById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Videos.findById({ _id: id });

  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const addViews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedVideo = await Videos.findByIdAndUpdate(
    id,
    {
      $inc: {
        views: 1,
      },
    },
    { new: true }
  );

  if (!updatedVideo) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "View increased by 1 successfully.")
    );
});

export { uploadVideo, updateVideo, getAllVideos, getVideosById, addViews };
