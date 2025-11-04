import express from 'express';
import { login, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// 登录路由
router.post('/login', login);

// 令牌校验路由
router.get('/verify', verifyToken);

export default router;