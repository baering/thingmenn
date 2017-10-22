import React from 'react'

import partyService from '../../services/party-service'
import partySummaryService from '../../services/party-summary-service'

import DetailsHeader from '../../widgets/details-header'
import Piechart from '../../widgets/piechart'
import BarChart from '../../widgets/bar-chart'
import ColorLegend from '../../widgets/color-legend'
// import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'

import './styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      party: {},
      voteSummary: { voteSummary: {}, votePercentages: [] },
      subjectSummary: [],
      nouns: [],
      speechSummary: {},
    }
  }

  componentDidMount() {
    const { partyId } = this.props.params

    if (partyId === this.state.party.id) {
      return
    }

    const lthing = this.props.params.lthing

    partyService.getPartyDetailsByLthing(partyId, lthing).then(party => {
      this.setState({ party })
    })

    partySummaryService.getPartyVoteSummaryByLthing(partyId).then(voteSummary => {
      this.setState({ voteSummary })
    })

    // partySummaryService.getPartySubjects(partyId).then(subjectSummary => {
    //   this.setState({ subjectSummary })
    // })
    //
    // partySummaryService.getPartyNouns(partyId).then(nouns => {
    //   this.setState({ nouns })
    // })
    //
    // partySummaryService.getPartySpeeches(partyId).then(speechSummary => {
    //   this.setState({ speechSummary })
    // })
  }

  render() {
    const {
      party,
      voteSummary,
      nouns,
      speechSummary,
      subjectSummary,
    } = this.state

    return (
      <div className="fill">
        <DetailsHeader
          speechSummary={speechSummary}
          voteSummary={voteSummary}
          id={party.id}
          mpName={party.name}
          description={party.about}
          imagePath={party.imagePath}
        />

        <div className="Details">
          <div className="Details-item">
            <h1 className="heading">Skipting atkvæða</h1>
            <Piechart voteSummary={voteSummary} />
            <ColorLegend includeAbsent={true} />
          </div>

          <div className="Details-item">
            {/* <Words divider="12" title="Mest talað um" words={nouns} /> */}
          </div>

          <div className="Details-item Details-item--large">
            <Speeches title="Skipting ræðutíma" speechSummary={speechSummary} />
          </div>

          <div className="Details-item Details-item--large">
            <h1 className="heading">Atkvæðaskipting eftir efnisflokkum</h1>
            <ColorLegend />
            {subjectSummary.map(subject => (
              <BarChart subjectSummary={subject} key={subject.subject} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
