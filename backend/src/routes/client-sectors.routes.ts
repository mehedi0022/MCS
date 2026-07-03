import { Router } from "express"
import {
  createClientSector,
  deleteClientSector,
  getClientSectors,
  getClientSectorsAdmin,
  updateClientSector,
} from "../controllers/client-sector.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", getClientSectors)
router.get("/admin", requireAuth, getClientSectorsAdmin)
router.post("/", requireAuth, createClientSector)
router.put("/:id", requireAuth, updateClientSector)
router.delete("/:id", requireAuth, deleteClientSector)

export default router
