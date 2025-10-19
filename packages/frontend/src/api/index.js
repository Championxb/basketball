// API服务模块
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 请求超时时间：10秒
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        // 例如：添加token
        // if (localStorage.getItem('token')) {
        //     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        // }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response.data;
    },
    (error) => {
        // 对响应错误做点什么
        if (error.response) {
            // 服务器返回了错误状态码
            console.error('API错误:', error.response.status, error.response.data);
        } else if (error.request) {
            // 请求已经发出，但没有收到响应
            console.error('API请求无响应:', error.request);
        } else {
            // 设置请求时发生了错误
            console.error('API请求错误:', error.message);
        }
        return Promise.reject(error);
    }
);

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
export function get(url, params = {}, options = {}) {
    return apiClient.get(url, { params, ...options });
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
export function post(url, data = {}, options = {}) {
    return apiClient.post(url, data, options);
}

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
export function put(url, data = {}, options = {}) {
    return apiClient.put(url, data, options);
}

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回Promise对象
 */
export function del(url, options = {}) {
    return apiClient.delete(url, options);
}

// API接口
export const API = {
    // 首页接口
    getWelcome: () => get('/'),
    getHello: () => get('/hello'),

    // 用户接口
    getUserInfo: () => get('/api/user'),

    // 产品接口
    getProducts: () => get('/api/products'),

    // 可以添加更多API接口...
};

export default API;