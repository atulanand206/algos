import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import { Controller } from './Binge/v1/controller/Controller'
import { WebSckts } from './Binge/v1/utils/_websockets'
import { GameManager } from './Binge/v1/dataStore/GameManager'

ReactDOM.render(
  <React.StrictMode>
    <Controller />
  </React.StrictMode>,
  document.getElementById('root')
);

new WebSckts()
new GameManager()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();