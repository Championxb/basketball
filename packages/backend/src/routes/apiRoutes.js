import express from 'express';
import { getApiData } from '../controllers/apiController.js';

const router = express.Router();

// API示例路由
router.get('/', getApiData);

export default router;
