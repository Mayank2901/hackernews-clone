import { fetchFeed } from '../api'
import queryString from 'query-string';

export const fetchFeedPage = (path) => (dispatch) =>{
    var page = 0;
    if(path.indexOf('?') >= 0){
        const queryValues = queryString.parse(path.substring(path.indexOf('?')));
        if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
            page = parseInt(queryValues.page)
            if(isNaN(page)){
                page = 0
            }
            return fetchFeed(page).then(res => dispatch({
                type: "SET_FEED_DATA",
                res
            }))
        }
    }
    else{
        return fetchFeed(page).then(res => dispatch({
            type: "SET_FEED_DATA",
            res
        }))
    }
}