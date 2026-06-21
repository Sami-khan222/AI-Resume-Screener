import { Router } from "express";
import { uploadResume } from "../middleware/uploadResume.js";
import {
  createScreening,
  listScreenings,
  getScreening,
  deleteScreening,
} from "../controllers/screeningController.js";

const router = Router();

router.post("/", uploadResume.single("resume"), createScreening);
router.get("/", listScreenings);
router.get("/:id", getScreening);
router.delete("/:id", deleteScreening);

export default router;
