import apiClient from './interceptors.js';

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