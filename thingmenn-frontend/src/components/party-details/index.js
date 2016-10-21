import React from 'react';

import PartyService from '../../services/party-service'
import PartySummaryService from '../../services/party-summary-service'

import DetailsHeader from '../../widgets/details-header'
import Piechart from '../../widgets/piechart'
import ColorLegend from '../../widgets/color-legend'
import Words from '../../widgets/words'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.partyService = new PartyService()
    this.partySummaryService = new PartySummaryService()

    this.state = {
      party: this.partyService.getPartyDetailsIfCached(),
      voteSummary: this.partySummaryService.getPartyVotesIfCached(),
      // subjectSummary: this.partySummaryService.getPartySubjectsIfCached(),
      nouns: this.partySummaryService.getPartyNounsIfCached(),
    }
  }

  componentDidMount() {
    const { partyId } = this.props.params
    if (!this.state.party.id) {
      this.partyService.getPartyDetails(partyId)
        .then(party => {
          this.setState({ party })
        })
    }

    if (!this.state.voteSummary.voteSummary.numberOfVotes) {
      this.partySummaryService.getPartyVotes(partyId)
        .then(voteSummary => {
          this.setState({ voteSummary })
        })
    }

    // if (!this.state.subjectSummary.length) {
    //   this.partySummaryService.getPartySubjects(partyId)
    //     .then(subjectSummary => {
    //       this.setState({ subjectSummary })
    //     })
    // }

    if (!this.state.nouns.length) {
      this.partySummaryService.getPartyNouns(partyId)
        .then(nouns => {
          this.setState({ nouns })
        })
    }
  }

  render() {
    const { party, voteSummary, nouns } = this.state

    return (
      <div className="fill">
        <DetailsHeader voteSummary={voteSummary} {...party} />

        <div className='Details'>
          <div className="Details-item">
          <h1 className="heading">Skipting atkvæða</h1>
            <Piechart voteSummary={voteSummary} />
            <ColorLegend/>
          </div>

          <div className="Details-item">
            <Words divider="3" title="Mest talað um" words={nouns} />
          </div>
        </div>
      </div>
    );
  }
}
