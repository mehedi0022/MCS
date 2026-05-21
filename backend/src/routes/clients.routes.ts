import { Router } from "express"
import {
  createClient,
  deleteClient,
  getClients,
  getClientsAdmin,
  updateClient,
} from "../controllers/client.controller.js"
import { requireAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = Router()

router.get("/", getClients)
router.get("/admin", requireAuth, getClientsAdmin)
router.post("/", requireAuth, upload.single("logo"), createClient)
router.put("/:id", requireAuth, upload.single("logo"), updateClient)
router.delete("/:id", requireAuth, deleteClient)

export default router
