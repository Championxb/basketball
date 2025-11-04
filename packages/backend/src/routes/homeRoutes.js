/**
 * 首页路由
 */
import express from 'express';
import { getHomePage } from '../controllers/homeController.js';

const router = express.Router();

// 首页路由
router.get('/', getHomePage);

export default router;
