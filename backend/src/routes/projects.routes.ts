import { Router } from "express"
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getProjects)
router.post("/", requireAuth, upload.single("file"), createProject)
router.put("/:id", requireAuth, upload.single("file"), updateProject)
router.delete("/:id", requireAuth, deleteProject)

export default router
