import { fetchFeed } from '../api'


export const fetchFeedPage = () => (dispatch) =>
    fetchFeed().then(res => dispatch({
        type: "SET_FEED_DATA",
        res
    }))