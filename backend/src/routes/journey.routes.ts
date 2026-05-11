import { Router } from "express"
import {
  createJourney,
  deleteJourney,
  getJourneyAdmin,
  getJourneyPublic,
  updateJourney,
} from "../controllers/journey.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", getJourneyPublic)
router.get("/admin", requireAuth, getJourneyAdmin)
router.post("/", requireAuth, createJourney)
router.put("/:id", requireAuth, updateJourney)
router.delete("/:id", requireAuth, deleteJourney)

export default router

