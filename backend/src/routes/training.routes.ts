import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import {
  createTrainingItem,
  deleteTrainingItem,
  getTrainingAdmin,
  getTrainingPublic,
  replaceTrainingPage,
  updateTrainingItem,
  updateTrainingPage,
} from "../controllers/training.controller.js"

const router = Router()

router.get("/", getTrainingPublic)
router.get("/admin", requireAuth, getTrainingAdmin)
router.put("/page", requireAuth, replaceTrainingPage)
router.patch("/page", requireAuth, updateTrainingPage)
router.post("/items", requireAuth, createTrainingItem)
router.put("/items/:id", requireAuth, updateTrainingItem)
router.delete("/items/:id", requireAuth, deleteTrainingItem)

export default router
