import React from 'react';

import PartyService from '../../services/party-service'
import PartySummaryService from '../../services/party-summary-service'

import DetailsHeader from '../../widgets/details-header'
import Piechart from '../../widgets/piechart'
import BarChart from '../../widgets/bar-chart'
import ColorLegend from '../../widgets/color-legend'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.partyService = new PartyService()
    this.partySummaryService = new PartySummaryService()

    this.state = {
      party: this.partyService.getPartyDetailsIfCached(),
      voteSummary: this.partySummaryService.getPartyVotesIfCached(),
      subjectSummary: this.partySummaryService.getPartySubjectsIfCached(),
      nouns: this.partySummaryService.getPartyNounsIfCached(),
      speechSummary: this.partySummaryService.getPartySpeechesIfCached(),
    }
  }

  componentDidMount() {
    const { partyId } = this.props.params
    if (partyId === this.state.party.id) {
      return;
    }

    this.partyService.getPartyDetails(partyId)
      .then(party => {
        this.setState({ party })
      })

    this.partySummaryService.getPartyVotes(partyId)
      .then(voteSummary => {
        this.setState({ voteSummary })
      })

    this.partySummaryService.getPartySubjects(partyId)
      .then(subjectSummary => {
        this.setState({ subjectSummary })
      })

    this.partySummaryService.getPartyNouns(partyId)
      .then(nouns => {
        this.setState({ nouns })
      })

    this.partySummaryService.getPartySpeeches(partyId)
      .then(speechSummary => {
        this.setState({ speechSummary })
      })
  }

  render() {
    const { party, voteSummary, nouns, speechSummary, subjectSummary } = this.state

    return (
      <div className="fill">
        <DetailsHeader
          speechSummary={speechSummary}
          voteSummary={voteSummary}
          {...party} />

        <div className='Details'>
          <div className="Details-item">
          <h1 className="heading">Skipting atkvæða</h1>
            <Piechart voteSummary={voteSummary} />
            <ColorLegend/>
          </div>

          <div className="Details-item">
            <Words divider="4" title="Mest talað um" words={nouns} />
          </div>

          <div className="Details-item Details-item--large">
            <Speeches title="Skipting ræðutíma" speechSummary={speechSummary} />
          </div>

          <div className="Details-item Details-item--large">
            <h1 className="heading">Atkvæðaskipting eftir efnisflokkum</h1>
            <ColorLegend/>
            {subjectSummary.map(subject => (
              <BarChart subjectSummary={subject} key={subject.subject} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
