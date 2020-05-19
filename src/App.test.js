import React from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server'
import App from './App';
import Feed from './components/feed';

test('renders learn react link', () => {
  const { getByText } = render(<Feed />,{hydrate: true});
  const linkElement = getByText(/testing it out/i);
  expect(linkElement).toBeInTheDocument();
});
