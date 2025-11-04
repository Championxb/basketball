import { get } from './request.js';

// 首页相关API接口
export const homeAPI = {
    // 获取欢迎信息
    getWelcome: () => get('/'),
    // 获取问候信息
    getHello: () => get('/hello'),
};