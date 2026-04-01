import { get } from './request.js';

function getAllHighlight(data = {}){
    return get('/player/getAllHighlight', data);
}

function getPlayerScore(data = {}){
    return get('/player/playerScoreBoard', data);
}

export { getAllHighlight, getPlayerScore };