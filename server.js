  
const App = require('./src/App').default
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const path = require('path')
const express = require('express')

const app = express()
const fs = require("fs");
const routes = require('./src/routes').default
const matchPath = require('react-router').matchPath;
const StaticRouter = require('react-router-dom').StaticRouter;
const createStore = require('./src/store').default

const serveHTML = (req, res, next) => {
        // insert html into the reponse from index.html
        const filePath = path.resolve(__dirname, 'build/index.html');
        let context = {}
        fs.readFile(filePath, 'utf8',async (err, htmlData) => {
            if (err) {
                console.error('err', err);
                return res.status(404).end()
            }
            else{
                const store = createStore()
                // inject the rendered app into our html and send it
                let match = false, promise
                await routes.some(route => {
                    match = matchPath(req.path, {
                        path: route.path,
                        exact: true,
                    });
                    const { serverFetch } = route;
                    if (match && serverFetch){
                        promise = store.dispatch(serverFetch(req.url))
                    }

                    return match
                })
                if(match){
                    await promise
                    // render the app as a string
                    const html = ReactDOMServer.renderToString(<StaticRouter location={req.url} context={context}><App store={store}/></StaticRouter>);

                    res.set('Content-Type', 'text/html')
                    res.status(200).send(
                        htmlData.replace(
                            '<div id="root"></div>',
                            `<div id="root">${html}</div>`
                        ).replace(
                            '__REDUX_DATA__',
                            JSON.stringify(store.getState())
                        )
                    );
                }
                else{
                    match = matchPath(req.path, {
                        path: "/static/*",
                    });
                    if(match){
                        next()
                    }
                    else{
                        // render the app as a string
                        const html = ReactDOMServer.renderToString(
                            <StaticRouter location={req.url} context={{}}>
                                <App store={store}/>
                            </StaticRouter>
                        );

                        res.set('Content-Type', 'text/html')
                        res.status(404).send(
                            htmlData.replace(
                                '<div id="root"></div>',
                                `<div id="root">${html}</div>`
                            ).replace(
                                '__REDUX_DATA__',
                                JSON.stringify(store.getState())
                            )
                        );
                    }
                }
            }
        });
}

app.get('/*', serveHTML)

app.use(express.static(path.resolve(__dirname, 'build')))
app.use(express.static(path.resolve(__dirname, 'public')))


app.listen(process.env.PORT || 3000)