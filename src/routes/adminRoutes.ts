import { Router } from "express";
import protect from "../middleware/auth";
const router = Router();
import {
  deleteCompleted60,
  downloadFile,
  getDatainCSV
} from "../controllers/adminController";

router.route("/delete-completed-many").get(protect, deleteCompleted60);
router.route("/file").get(downloadFile);
router.route("/makefile").get(getDatainCSV);

export default router;
