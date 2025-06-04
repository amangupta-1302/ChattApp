import express from "express"
import { signup, login, logout, updateProfile, checkCurrentUser } from "../controllers/authController.js"
import { validateToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/updateprofile", validateToken, updateProfile)
router.get("/check", validateToken, checkCurrentUser) // when page refreshes .. need to check if user is authenticated or not 

export default router