import { Router } from "express"
import {
  createService,
  deleteService,
  getServicesAdmin,
  getServices,
  updateService,
} from "../controllers/service.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getServices)
router.get("/admin", requireAuth, getServicesAdmin)
router.post("/", requireAuth, upload.single("file"), createService)
router.put("/:id", requireAuth, upload.single("file"), updateService)
router.delete("/:id", requireAuth, deleteService)

export default router
