import Feed from './components/feed.js'
import FourOFour from './404.js'
import { fetchFeedPage } from './store/index'

const routes= [
    {
        path: '/',
        component: Feed,
        exact: true,
        serverFetch: fetchFeedPage,
    },
    {
        component: FourOFour
    }
]

export default routes;