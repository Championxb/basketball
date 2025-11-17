import { post } from './request.js';

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

