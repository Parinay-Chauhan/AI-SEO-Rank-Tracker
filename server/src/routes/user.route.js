import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  currentUser,
  changePassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, currentUser );
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
