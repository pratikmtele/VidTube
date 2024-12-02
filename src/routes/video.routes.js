import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addViews,
  getAllVideos,
  getVideosById,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

// insecured routes
videoRouter.route("/inc-view/:id").patch(addViews);

// secured routes
videoRouter.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

videoRouter
  .route("/update/:id")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

videoRouter.route("/videos").get(verifyJWT, getAllVideos);
videoRouter.route("/:id").get(verifyJWT, getVideosById);

export { videoRouter };
