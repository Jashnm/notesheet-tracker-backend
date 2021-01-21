import express from "express";
import { createSchool, createDept } from "../controllers/deptSchoolController";

const router = express.Router();

router.post("/school/new", createSchool);
router.post("/dept/new", createDept);

export default router;
