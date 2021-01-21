import { Router } from "express";
import protect from "../middleware/auth";
const router = Router();
import {
  deleteCompleted60,
  downloadFile,
  getAllUsers,
  getDatainCSV,
  isUserAdmin
} from "../controllers/adminController";

router
  .route("/delete-completed-many")
  .get(protect, isUserAdmin, deleteCompleted60);
router.route("/file").get(protect, isUserAdmin, downloadFile);
router.route("/makefile").get(protect, isUserAdmin, getDatainCSV);
router.route("/users").get(protect, isUserAdmin, getAllUsers);
router.route("/user/:uuid").delete(protect, isUserAdmin, getAllUsers);

export default router;
