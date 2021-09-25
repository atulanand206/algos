import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App';
import reportWebVitals from './reportWebVitals'
import Algorithm from './Algorithm/Algorithm';
import Template from './Template/Template'
import { Board } from './Binge/Landing/Board'
import { Lobby } from './Binge/Lobby/Lobby'

ReactDOM.render(
  <React.StrictMode>
    <Lobby />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();