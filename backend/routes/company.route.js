import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js"; 
import { getCompany, getCompanyById, registerCompany, updateCompany  , deleteCompany} from "../controllers/Company.controller.js";
import { singleUpload } from "../../backend/middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany);
router.route("/delete/:id").delete(isAuthenticated, deleteCompany);

export default router;