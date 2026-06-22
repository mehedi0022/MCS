import { Router } from "express"
import {
  createDeliveryApproachStep,
  deleteDeliveryApproachStep,
  getDeliveryApproachAdmin,
  getDeliveryApproachPublic,
  updateDeliveryApproachSection,
  updateDeliveryApproachStep,
} from "../controllers/delivery-approach.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", getDeliveryApproachPublic)
router.get("/admin", requireAuth, getDeliveryApproachAdmin)
router.put("/section", requireAuth, updateDeliveryApproachSection)
router.post("/steps", requireAuth, createDeliveryApproachStep)
router.put("/steps/:id", requireAuth, updateDeliveryApproachStep)
router.delete("/steps/:id", requireAuth, deleteDeliveryApproachStep)

export default router
