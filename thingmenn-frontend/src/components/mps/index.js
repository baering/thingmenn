import React from 'react';
import classnames from 'classnames';
import 'whatwg-fetch'

import Mp from '../../widgets/mp'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mps: [],
    }
  }

  componentDidMount() {
    fetch('http://api-dot-thingmenn.appspot.com/api/mps')
      .then(response => {
        return response.json()
      })
      .then(mps => {
        this.setState({
          mps,
        })
      })
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }

  render() {
    const { mps } = this.state

    return (
      <div className="Mps">
        <h1 className="Mps-header">Þingmenn</h1>
        <section className="Mps-list">
          {mps.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </section>
      </div>
    );
  }
}
