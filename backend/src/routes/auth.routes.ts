import { Router } from "express"
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refresh,
  resetPassword,
} from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.get("/me", requireAuth, getMe)

export default router
