// API服务模块入口文件
// 统一导出所有API接口

// 导出HTTP请求方法
export { get, post, put, del } from './request.js';

// 导出认证相关API
export { login } from './auth.js';

// 导出各模块API
export { userAPI } from './user.js';
export { productAPI } from './product.js';
export { homeAPI } from './home.js';

// 导出默认的API对象（兼容原有使用方式）
import { userAPI } from './user.js';
import { productAPI } from './product.js';
import { homeAPI } from './home.js';
import { login, verifyToken } from './auth.js';

const API = {
    // 首页接口
    getWelcome: homeAPI.getWelcome,
    getHello: homeAPI.getHello,

    // 用户接口
    getUserInfo: userAPI.getUserInfo,

    // 产品接口
    getProducts: productAPI.getProducts,

    // 认证接口
    login,
    verifyToken,
    
    // 可以添加更多API接口...
};

export default API;