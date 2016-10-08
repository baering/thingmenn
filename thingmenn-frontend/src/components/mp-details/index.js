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
      <div className={classnames('MpDetails', className)}>
        <h1>{mp.name}</h1>
      </div>
    );
  }
}
