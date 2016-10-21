import React from 'react';
import 'whatwg-fetch'

import { apiUrl } from '../../config'
import Party from '../../widgets/party'
import List from '../../widgets/list'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parties: [],
    }
  }

  componentDidMount() {
    fetch(`${apiUrl}/api/parties`)
      .then(response => {
        return response.json()
      })
      .then(parties => {
        this.setState({
          parties,
        })
      })
      .catch(error => {
        console.log(`Error: ${error}`)
      })
  }

  render() {
    const { parties } = this.state

    return (
      <div className="fill">
        <h1 className="title">Allir þingflokkar</h1>
        <List>
          {parties.map(party => (
            <Party key={party.id} {...party} />
          ))}
        </List>
      </div>
    );
  }
}
