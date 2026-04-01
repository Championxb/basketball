import { get } from './request.js'

function getAllData(clientId = 9) {
    return get(`/sse/connect/${clientId}`, clientId);
}

export { getAllData };