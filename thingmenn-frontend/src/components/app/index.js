import React from 'react'
import PropTypes from "prop-types";

import Nav from '../../widgets/nav'
import Footer from '../../widgets/footer'

import './reset.css'
import './index.css'
import './typography.css'

export default class App extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div className="contain">
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500|Lora" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/typicons/2.0.8/typicons.min.css" rel="stylesheet" />
        <Nav />
        <main className="Main">
          {children}
          <Footer />
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
}
