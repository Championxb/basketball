import { get } from './request.js';

// 产品相关API接口
export const productAPI = {
    // 获取产品列表
    getProducts: () => get('/api/products'),
};