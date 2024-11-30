import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateUserAvatar,
  updateCoverImage,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// unsecured routes // anyone can access
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

//secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/change-password").get(verifyJWT, changeCurrentPassword);
userRouter
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);
userRouter
  .route("/update-cover-image")
  .post(verifyJWT, upload.single("coverImage"), updateCoverImage);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/channels/:username").get(verifyJWT, getUserChannelProfile);
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);

export { userRouter };
