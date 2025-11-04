import express from "express";
import homeRoutes from "./homeRoutes.js";
import apiRoutes from "./apiRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

// 首页路由
router.use("/", homeRoutes);

// API路由
router.use("/api", apiRoutes);

// 认证路由
router.use("/api", authRoutes);

export default router;
