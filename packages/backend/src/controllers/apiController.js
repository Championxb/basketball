/**
 * API控制器
 */
class ApiController {
    /**
     * 获取用户信息示例
     * @param {Object} ctx - Koa上下文
     */
    async getUserInfo(ctx) {
        // 这里可以从数据库获取用户信息
        // 目前返回模拟数据
        ctx.body = {
            status: 'success',
            data: {
                id: 1,
                username: '测试用户',
                email: 'test@example.com',
                role: 'user',
                createdAt: new Date()
            }
        };
    }

    /**
     * 获取产品列表示例
     * @param {Object} ctx - Koa上下文
     */
    async getProducts(ctx) {
        // 这里可以从数据库获取产品列表
        // 目前返回模拟数据
        ctx.body = {
            status: 'success',
            data: [
                { id: 1, name: '产品1', price: 99.99, description: '这是产品1的描述' },
                { id: 2, name: '产品2', price: 199.99, description: '这是产品2的描述' },
                { id: 3, name: '产品3', price: 299.99, description: '这是产品3的描述' }
            ]
        };
    }
}

export default new ApiController();
