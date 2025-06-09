import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllCompanies,
  toggleCompanyApproval,
  getAllJobsForAdmin,
  deleteJobByAdmin
} from "../controllers/Admin.Controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

// Companies
router.get("/companies", getAllCompanies);
router.put("/companies/:companyId/toggle-approval", toggleCompanyApproval);

//jobs
router.get("/all", getAllJobsForAdmin);
router.delete("/job/:jobId", deleteJobByAdmin);

export default router;
