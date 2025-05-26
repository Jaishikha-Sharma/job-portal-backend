import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/User.Controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/logout").get(logout);
router.put("/save-job/:jobId", isAuthenticated, saveJob);
router.route("/unsave-job/:jobId").put(isAuthenticated, unsaveJob);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);

export default router;
