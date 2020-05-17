import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes.js'
import { Provider } from 'react-redux';

function App(props) {
  return (
    <Provider store={props.store}>
      <Switch>
        {routes.map(route => (
          <Route {...route} />
        ))}
      </Switch>
    </Provider>
  )
}

export default App;
