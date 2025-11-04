import { get } from './request.js';

// 用户相关API接口
export const userAPI = {
    // 获取用户信息
    getUserInfo: () => get('/api/user'),
};