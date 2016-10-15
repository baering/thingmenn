import React from 'react';
import classnames from 'classnames';
import 'whatwg-fetch'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mp: {},
    }
  }

  componentDidMount() {
    const { mpId } = this.props.params

    fetch(`http://localhost:8080/api/mps/${mpId}`)
      .then(response => {
        return response.json()
      })
      .then(mp => {
        this.setState({
          mp,
        })
      })
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }

  render() {
    const { className } = this.props;
    const { mp } = this.state

    return (
      <div className='mp-details'>
        <div className='mp-details__introduction'>
          <div
            className='mp-details__introduction-image'
            style={{
              backgroundImage: `url(${mp.imagePath})`
            }}
          ></div>
          <div className='mp-details__introduction-text'>
            <h1 className='mp-details__introduction-name'>{mp.name}</h1>
            <h2 className='mp-details__introduction-party'>{mp.party}</h2>
          </div>
        </div>
      </div>
    );
  }
}
