  
const App = require('./src/App').default
const React = require('react')
const ReactDOMServer = require('react-dom/server')

const path = require('path')
const express = require('express')

const PORT = 3000
const app = express()
const fs = require("fs");
const routes = require('./src/routes').default
const matchPath = require('react-router').matchPath;
const StaticRouter = require('react-router-dom').StaticRouter;

const serveHTML = (req, res, next) => {
        console.log('serveHTML')
        // insert html into the reponse from index.html
        const filePath = path.resolve(__dirname, 'build/index.html');
        fs.readFile(filePath, 'utf8', (err, htmlData) => {
            if (err) {
                console.error('err', err);
                return res.status(404).end()
            }
            // render the app as a string
            const html = ReactDOMServer.renderToString(
                <StaticRouter location={req.url} context={{}}>
                    <App />
                </StaticRouter>
            );

            // inject the rendered app into our html and send it
            let match = routes.find(route => matchPath(req.path, {
                path: route.path,
                exact: true,
            }));
            if(match){
                res.set('Content-Type', 'text/html')
                res.status(200).send(
                    htmlData.replace(
                        '<div id="root"></div>',
                        `<div id="root">${html}</div>`
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
                    res.set('Content-Type', 'text/html')
                    res.status(404).send(
                        htmlData.replace(
                            '<div id="root"></div>',
                            `<div id="root">${html}</div>`
                        )
                    );
                }
            }
        });
}

app.get('/*', serveHTML)

app.use(express.static(path.resolve(__dirname, 'build')))
app.use(express.static(path.resolve(__dirname, 'public')))


app.listen(PORT)