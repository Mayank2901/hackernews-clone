import { fetchFeed } from '../api'
import queryString from 'query-string';

export const fetchFeedPage = (path) => (dispatch) =>{
    const queryValues = queryString.parse(path.substring(path.indexOf('?')));
    var page;
    if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
        const page = parseInt(queryValues.page)
        if(isNaN(page)){
            page = 0
        }
        return fetchFeed(page).then(res => dispatch({
            type: "SET_FEED_DATA",
            res
        }))
    }
    else{
        return fetchFeed(page).then(res => dispatch({
            type: "SET_FEED_DATA",
            res
        }))
    }
}