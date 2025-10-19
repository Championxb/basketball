/**
 * 首页控制器
 */
class HomeController {
    /**
     * 获取欢迎信息
     * @param {Object} ctx - Koa上下文
     */
    async getWelcome(ctx) {
        ctx.body = {
            message: '欢迎使用Koa后端API',
            status: 'success',
            timestamp: new Date()
        };
    }

    /**
     * 获取Hello信息
     * @param {Object} ctx - Koa上下文
     */
    async getHello(ctx) {
        ctx.body = {
            message: '你好，世界！',
            status: 'success'
        };
    }
}

export default new HomeController();
