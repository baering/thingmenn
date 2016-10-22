import React from 'react';

import PartyService from '../../services/party-service'
import PartyBadge from '../../widgets/partybadge'

import './styles.css';

export default class PartyFilter extends React.Component {
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
    const currentlyActive = this.props.activeParties || []
    const checkIfSelected = (party) => currentlyActive.indexOf(party) !== -1 ? 'ActiveParty' : ''
    return (
      <div className="PartyFilter SubNav-item">
        {parties.map(party => (
          <div onClick={this.props.handlePartyFilter} key={party.id} className={checkIfSelected(party.id)}>
            <PartyBadge party={party.id} />
          </div>
        ))}
      </div>
    );
  }
}

PartyFilter.propTypes = {
  activeParties: React.PropTypes.array,
}

