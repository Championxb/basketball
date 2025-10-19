/**
 * 路由索引文件
 */
import homeRoutes from './homeRoutes.js';
import apiRoutes from './apiRoutes.js';

/**
 * 注册所有路由
 * @param {Object} app - Koa应用实例
 */
export default (app) => {
    // 注册首页路由
    app.use(homeRoutes.routes()).use(homeRoutes.allowedMethods());

    // 注册API路由
    app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods());

    // 可以在这里注册更多路由...

    console.log('所有路由已注册');
};