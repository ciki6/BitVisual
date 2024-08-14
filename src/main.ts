import "./style.css";

import React from 'react';
import ReactDOM from 'react-dom';
import router from "./router";
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
