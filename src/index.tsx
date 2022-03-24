import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {register} from "@strategies/stores";
import RootStore from "./stores/RootStore";

register({
    root: new RootStore('COF_EXAMPLE_FILE'),
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
