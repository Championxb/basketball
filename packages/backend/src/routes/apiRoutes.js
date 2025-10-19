/**
 * API路由
 */
import Router from 'koa-router';
import apiController from '../controllers/apiController.js';

const router = new Router({
    prefix: '/api'
});

// 用户信息路由
router.get('/user', apiController.getUserInfo);

// 产品列表路由
router.get('/products', apiController.getProducts);

export default router;
