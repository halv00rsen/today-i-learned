import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

console.log(
  `Client version: ${import.meta.env.VITE_CLIENT_VERSION}`
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
