import { get } from './request.js';

function getAllHighlight(data = {}){
    return get('/highlight/getAllHighlight', data);
}


export { getAllHighlight };