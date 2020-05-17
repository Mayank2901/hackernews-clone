import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes.js'

function App() {
  return (
    <Switch>
      {routes.map(route => (
        <Route {...route} />
      ))}
    </Switch>
  )
}

export default App;
