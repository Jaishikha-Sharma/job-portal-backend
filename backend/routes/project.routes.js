
import express from "express";
import { createProject, getAllProjects  , deleteProject } from "../controllers/project.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createProject);
router.get("/all", isAuthenticated, getAllProjects);
router.delete("/:id", isAuthenticated, deleteProject);

export default router;
