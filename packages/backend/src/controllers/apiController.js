/**
 * @description 获取API数据
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getApiData = (req, res) => {
    res.status(200).json({
        code: 0,
        message: '欢迎使用API',
        data: null
    });
};

/**
 * @description 获取产品列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getProducts = (req, res) => {
    // 模拟产品数据
    const products = [
        { id: 1, name: '产品1', price: 99.99, description: '这是产品1的描述' },
        { id: 2, name: '产品2', price: 199.99, description: '这是产品2的描述' },
        { id: 3, name: '产品3', price: 299.99, description: '这是产品3的描述' }
    ];
    res.status(200).json({
        code: 0,
        message: '获取产品列表成功',
        data: products
    });
};

/**
 * @description 获取用户信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export const getUserInfo = (req, res) => {
    // 模拟用户信息
    const userInfo = {
        id: 1,
        username: '测试用户',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date()
    };
    res.status(200).json({
        code: 0,
        message: '获取用户信息成功',
        data: userInfo
    });
};
