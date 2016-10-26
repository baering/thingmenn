import React from 'react';

import partyService from '../../services/party-service'
import partySummaryService from '../../services/party-summary-service'

import DetailsHeader from '../../widgets/details-header'
import Piechart from '../../widgets/piechart'
import BarChart from '../../widgets/bar-chart'
import ColorLegend from '../../widgets/color-legend'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'

import './styles.css';

export default class Mps extends React.Component {
  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.partyId !== this.props.params.partyId) {
      this.getData()
    }
  }

  async getData() {
    const { partyId } = this.props.params

    const [party, voteSummary, subjectSummary, nouns, speechSummary] =
        await Promise.all([
          partyService.getPartyDetails(partyId),
          partySummaryService.getPartyVotes(partyId),
          partySummaryService.getPartySubjects(partyId),
          partySummaryService.getPartyNouns(partyId),
          partySummaryService.getPartySpeeches(partyId),
        ])

    this.setState({
      party,
      voteSummary,
      subjectSummary,
      nouns,
      speechSummary,
    })
  }

  render() {
    if (!this.state) {
      return null
    }

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
            <ColorLegend includeAbsent={true} />
          </div>

          <div className="Details-item">
            <Words divider="12" title="Mest talað um" words={nouns} />
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
