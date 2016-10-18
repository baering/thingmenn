import React from 'react';
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
      <div>
        <h1 className="title">Þingmenn</h1>
        <section className="Mps">
          {mps.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </section>
      </div>
    );
  }
}
