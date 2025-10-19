/**
 * 错误处理中间件
 */
export default async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('服务器错误', err);

        // 设置状态码
        ctx.status = err.status || 500;

        // 设置响应体
        ctx.body = {
            message: err.message || '服务器内部错误',
            status: 'error',
            code: err.code || 'INTERNAL_SERVER_ERROR'
        };

        // 触发应用级错误事件
        ctx.app.emit('error', err, ctx);
    }
};