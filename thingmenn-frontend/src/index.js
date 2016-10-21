import React from 'react'
import ReactDOM from 'react-dom'

import Routes from './routes'

import Nav from './widgets/nav'
import Footer from './widgets/footer'

import './reset.css'
import './index.css'
import './typography.css'

ReactDOM.render(
  <div className="abc">
    <div className="contain">
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500|Lora" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/typicons/2.0.8/typicons.min.css" rel="stylesheet" />
      <Nav />
      <main className="fill">
        <Routes />
      </main>
    </div>
    <Footer />
  </div>,
  document.getElementById('root')
);
