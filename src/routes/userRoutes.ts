import express from "express";

import {
  createUser,
  updateUser,
  getUserProfile,
  loginUser,
  getUserCurrentNotesheets,
  logout
} from "../controllers/userController";
import protect from "../middleware/auth";
const router = express.Router();

router.post("/new", createUser);
router.post("/login", loginUser);
router.get("/logout", protect, logout);
router.route("/profile").get(protect, getUserProfile);
router.put("/:uuid", updateUser);
router.get("/notesheets", protect, getUserCurrentNotesheets);

export default router;
