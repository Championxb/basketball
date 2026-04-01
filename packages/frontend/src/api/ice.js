import { post, get } from './request.js';

export function iceTwoDimPush(data = {}) {
    return post('/api/ice/venue/push', data);
}

export function iceTwoDimClose(data = {}) {
    return post('/api/ice/venue/close', data);
}

export function icePush(data = {}) {
    return post('/api/ice/stream/push', data);
}

export  function iceClose(data = {}) {
     return post('/api/ice/stream/close', data);
}

//获取视频列表
export function iceVideoList() {
    return get('/api/ice/video/list');
}

//更换视频流
export function iceChangeVideo(data = '') {
    return post('/api/ice/video/change', data);
}
