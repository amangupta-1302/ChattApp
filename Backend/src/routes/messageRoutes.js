import express from 'express';
import { getMessages, usersforSidebar, sendMessage } from "../controllers/messageController.js"
import { validateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', validateToken, usersforSidebar);
router.get("/:id", validateToken, getMessages)

router.post("/send/:id", validateToken, sendMessage)

export default router