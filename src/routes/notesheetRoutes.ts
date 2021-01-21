import express from "express";
import {
  createNotesheet,
  nextUpdateNotesheet,
  getAllNotesheets,
  getAssociatedUsers,
  deleteNotesheet,
  getUserAllNotesheets
} from "../controllers/notesheetController";
import protect from "../middleware/auth";
const router = express.Router();

router.route("/new").post(protect, createNotesheet);
router.put("/:uuid", protect, nextUpdateNotesheet);
router.delete("/delete/:uuid", protect, deleteNotesheet);
router.get("/:uuid/users", protect, getAssociatedUsers);
router.get("/all-noauth", getAllNotesheets);
router.get("/allsheets", protect, getUserAllNotesheets);

export default router;
