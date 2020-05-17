import React from 'react';
import logo from './logo.svg';
import './App.css';

function FourOFour() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          404 Page.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          404
        </a>
      </header>
    </div>
  );
}

export default FourOFour;
