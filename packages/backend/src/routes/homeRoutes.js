/**
 * 首页路由
 */
import Router from 'koa-router';
import homeController from '../controllers/homeController.js';

const router = new Router();

// 首页路由
router.get('/', homeController.getWelcome);

// Hello路由
router.get('/hello', homeController.getHello);

export default router;
