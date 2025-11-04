import { post, get } from './request.js';

// 用户登录接口
export function login(data = {}) {
    return post('/api/auth/login', data);
}

// 校验令牌有效性
export function verifyToken(token) {
    return get('/api/auth/verify', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}