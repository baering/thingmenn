import React from 'react';
import 'whatwg-fetch'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parties: [],
    }
  }

  componentDidMount() {
    fetch('http://localhost:8080/api/parties')
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
      <div className='parties'>
        <ul className='parties__list'>
          {parties.map(party => (
            <li key={party.id} className='parties__list-item'>
              <a className='parties__list-link' href={`/thingflokkar/${party.id}`}>{party.name}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
