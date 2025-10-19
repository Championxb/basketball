/**
 * 日志中间件
 */
export default async (ctx, next) => {
    const start = Date.now();

    // 记录请求开始
    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - 开始请求`);

    await next();

    // 计算响应时间
    const ms = Date.now() - start;

    // 记录请求结束
    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - 响应状态: ${ctx.status} - 耗时: ${ms}ms`);
};