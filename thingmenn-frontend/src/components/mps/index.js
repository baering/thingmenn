import React from 'react';

import MpService from '../../services/mp-service'
import PartyService from '../../services/party-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css';

let searchString = ''

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.parties = new PartyService()

    this.mpService = new MpService()
    this.state = {
      mps: this.mpService.getMpsIfCached(),
      parties: [],
      searchInput: ''
    }
  }

  handlePartyFilter = (evt) => {
    const parties = this.state.parties
    const selectedParty = evt.target.getAttribute('data-party')
    var partOf = parties.indexOf(selectedParty) !== -1
    if (!partOf) {
      parties.push(selectedParty)
      this.setState({
        parties: parties
      })
    } else {
      const newparties = parties.filter(party => party !== selectedParty)
      this.setState({
        parties: newparties
      })
    }
}

  handleSearchInput = (evt) => {
    searchString = evt.target.value
    this.setState({
      searchInput: searchString
    })
  }

  partyFilter = (mp) => {
    return (this.state.parties.indexOf(mp.partySlug) !== -1)
  }

  searchFilter(mp) {
    if (searchString.length) {
      return (mp.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    }
    return mp
  }

  componentDidMount() {
    if (!this.state.parties.length) {
      this.parties.getParties()
        .then(parties => {
          const partyNames = []
          parties.map((party) => partyNames.push(party.id))
          this.setState({ parties: partyNames })
        })
    }
    if (!this.state.mps.length) {
      this.mpService.getMps()
        .then(mps => {
          this.setState({ mps })
        })
    }
  }

  render() {
    const { mps, searchInput, parties } = this.state
    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <SubNav handleSearchInput={this.handleSearchInput} activeParties={parties} handlePartyFilter={this.handlePartyFilter} searchInput={searchInput} />
        <List>
          {mps.filter(this.searchFilter).filter(this.partyFilter).map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
