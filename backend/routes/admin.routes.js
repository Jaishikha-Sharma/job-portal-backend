import express from "express";
import { getAllUsers, deleteUser } from "../controllers/Admin.Controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";  // your existing middleware
import isAdmin from "../middlewares/isAdmin.js"; // the one you just created

const router = express.Router();

router.use(isAuthenticated); // protects all routes below
router.use(isAdmin); // only admin can access below

// GET all users (except admins)
router.get("/users", getAllUsers);

// DELETE user by ID
router.delete("/users/:userId", deleteUser);

export default router;
