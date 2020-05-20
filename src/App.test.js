import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import createStore from "./store";
import { BrowserRouter } from 'react-router-dom';

const store = createStore({
  "feed_data" : {
    "hits": [
      {
        "created_at": "2015-07-21T01:22:58.000Z",
        "title": "Web Design: The First 100 Years (2014)",
        "url": "http://idlewords.com/talks/web_design_first_100_years.htm",
        "author": "jmduke",
        "points": 988,
        "story_text": null,
        "comment_text": null,
        "num_comments": 233,
        "story_id": null,
        "story_title": null,
        "story_url": null,
        "parent_id": null,
        "created_at_i": 1437441778,
        "relevancy_score": 6157,
        "_tags": [
            "story",
            "author_jmduke",
            "story_9920121"
        ],
        "objectID": "9920121",
        "_highlightResult": {
            "title": {
                "value": "Web Design: The First 100 Years (2014)",
                "matchLevel": "none",
                "matchedWords": []
            },
            "url": {
                "value": "http://idlewords.com/talks/web_design_first_100_years.htm",
                "matchLevel": "none",
                "matchedWords": []
            },
            "author": {
                "value": "jmduke",
                "matchLevel": "none",
                "matchedWords": []
            }
        }
      },
    ],
    "nbHits": 20978205,
    "page": 0,
    "nbPages": 1,
    "hitsPerPage": 20,
    "exhaustiveNbHits": false,
    "query": "",
    "params": "advancedSyntax=true&analytics=true&analyticsTags=backend&page=48&tags=story",
    "processingTimeMS": 3
  }
});

test('renders and checks for text', () => {
  const { getByText } = render(<BrowserRouter><App store={store}/></BrowserRouter>,{hydrate: true});
  const linkElement = getByText(/Vote Count/i);
  expect(linkElement).toBeInTheDocument();
});

test('check for upvote', () => {
  const { getByText } = render(<BrowserRouter><App store={store}/></BrowserRouter>,{hydrate: true});
  fireEvent.click(getByText('▲'))
  const linkElement = getByText(/989/i);
  expect(linkElement).toBeInTheDocument();
});

test('hide a story', () => {
  const { getByText } = render(<BrowserRouter><App store={store}/></BrowserRouter>,{hydrate: true});
  const linkElement = getByText(/Web Design/i);
  fireEvent.click(getByText('hide'))
  expect(linkElement).not.toBeInTheDocument();
});
