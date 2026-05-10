import { Router } from "express"
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getProjects)
router.get("/slug/:slug", getProjectBySlug)
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 12 },
  ]),
  createProject
)
router.put(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 12 },
  ]),
  updateProject
)
router.delete("/:id", requireAuth, deleteProject)

export default router
