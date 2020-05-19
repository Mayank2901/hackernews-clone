import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server'
import App from './App';
import Feed from './components/feed';
import createStore from "./store";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const store = createStore( {} );

test('renders and checks for text', () => {
  const { getByText } = render(<BrowserRouter><App store={store}/></BrowserRouter>,{hydrate: true});
  const linkElement = getByText(/Vote Count/i);
  expect(linkElement).toBeInTheDocument();
});
