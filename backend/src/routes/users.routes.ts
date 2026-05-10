import { Router } from "express"
import {
  createUser,
  getUserRoles,
  getUsers,
  updateUserStatus,
} from "../controllers/user.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.get("/", requireAuth, getUsers)
router.get("/roles", requireAuth, getUserRoles)
router.post("/", requireAuth, createUser)
router.patch("/:id/status", requireAuth, updateUserStatus)

export default router
