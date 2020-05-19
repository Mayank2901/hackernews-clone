import axios from 'axios';
import { apiURL } from './constants'

export function fetchFeed(page){
    return axios.get(apiURL + '/v1/search?tags=story&page=' + page)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log('error',error)
        return error
    })
}