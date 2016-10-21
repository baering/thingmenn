import React from 'react';

import PartyService from '../../services/party-service'

import Party from '../../widgets/party'
import List from '../../widgets/list'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.partyService = new PartyService()

    this.state = {
      parties: this.partyService.getPartiesIfCached(),
    }
  }

  componentDidMount() {
    if (!this.state.parties.length) {
      this.partyService.getParties()
        .then(parties => {
          this.setState({ parties })
        })
    }
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
