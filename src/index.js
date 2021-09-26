import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import { Lobby } from './Binge/Lobby/Lobby'
import { WebSckts } from './utils/_websockets'

ReactDOM.render(
  <React.StrictMode>
    <Lobby />
  </React.StrictMode>,
  document.getElementById('root')
);

new WebSckts()
WebSckts._instance.init()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();