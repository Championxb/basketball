import { post, get } from './request.js';

// 用户登录接口
export function login(data = {}) {
    return post('/api/login', data);
}

// 校验令牌有效性
export function verifyToken(token) {
    return get('/api/verify', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}