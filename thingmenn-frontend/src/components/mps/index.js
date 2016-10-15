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
    fetch('http://localhost:8080/api/mps')
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
    const { className } = this.props;
    const { mps} = this.state

    return (
      <div className={classnames('Mps', className)}>
        <div className="grid">
          {mps.map(mp => (
            <div key={mp.id} className="grid-cell">
              <Mp key={mp.id} {...mp} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
