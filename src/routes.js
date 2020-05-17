import Test from './Test.js'
import FourOFour from './404.js'

const routes= [
    {
        path: '/',
        component: Test,
        exact: true
    },
    {
        component: FourOFour
    }
]

export default routes;