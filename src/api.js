import axios from 'axios';

export function fetchFeed(){
    return axios.get('https://hn.algolia.com/api/v1/search?tags=front_page')
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log('error',error)
        return error
    })
}