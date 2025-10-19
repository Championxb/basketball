/**
 * 数据服务
 * 用于处理业务逻辑和数据操作
 */

/**
 * 获取用户数据
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} - 用户数据
 */
async function getUserData(userId) {
    // 这里可以连接数据库获取真实数据
    // 目前返回模拟数据
    return {
        id: userId,
        username: `用户${userId}`,
        email: `user${userId}@example.com`,
        role: 'user',
        createdAt: new Date()
    };
}

/**
 * 获取产品数据
 * @param {Object} filters - 过滤条件
 * @returns {Promise<Array>} - 产品数据列表
 */
async function getProductsData(filters = {}) {
    // 这里可以连接数据库获取真实数据
    // 目前返回模拟数据
    const products = [
        { id: 1, name: '产品1', price: 99.99, description: '这是产品1的描述', category: '电子产品' },
        { id: 2, name: '产品2', price: 199.99, description: '这是产品2的描述', category: '家居用品' },
        { id: 3, name: '产品3', price: 299.99, description: '这是产品3的描述', category: '电子产品' },
        { id: 4, name: '产品4', price: 399.99, description: '这是产品4的描述', category: '办公用品' }
    ];

    // 如果有过滤条件，进行过滤
    if (filters.category) {
        return products.filter(product => product.category === filters.category);
    }

    return products;
}

export {
    getUserData,
    getProductsData
};
