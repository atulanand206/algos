import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { Controller } from './Binge/v1/controller/Controller'
import { WebSckts } from './Binge/v1/utils/_websockets'

ReactDOM.render(
  <React.StrictMode>
    <Controller />
  </React.StrictMode>,
  document.getElementById('root')
);

new WebSckts()
