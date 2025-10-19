/**
 * 应用入口文件
 */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';

// 导入配置
import config from './config/index.js';

// 导入中间件
import { errorHandler, logger } from './middlewares/index.js';

// 导入路由
import registerRoutes from './routes/index.js';

// 创建Koa应用实例
const app = new Koa();

// 全局错误处理中间件（放在最前面）
app.use(errorHandler);

// 日志中间件
app.use(logger);

// 解析请求体中间件
app.use(bodyParser());

// CORS中间件
app.use(cors(config.cors));

// 注册所有路由
registerRoutes(app);

// 错误事件监听
app.on('error', (err, ctx) => {
    console.error('应用错误:', err);
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`环境: ${config.server.env}`);
});

export default app;
