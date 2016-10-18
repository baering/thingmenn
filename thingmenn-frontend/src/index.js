import React from 'react'
import ReactDOM from 'react-dom'

import Routes from './routes'

import Sidebar from './widgets/sidebar'

import './reset.css'
import './index.css'
import './typography.css'

ReactDOM.render(
  <div className="contain">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500|Lora" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/typicons/2.0.8/typicons.min.css" rel="stylesheet" />
    <Sidebar />
    <main className="fill">
      <Routes />
    </main>
  </div>,
  document.getElementById('root')
);
