import React from 'react';
import 'whatwg-fetch'

import { apiUrl } from '../../config'

import DetailsHeader from '../../widgets/details-header'
import Piechart from '../../widgets/piechart'
import ColorLegend from '../../widgets/color-legend'
import Words from '../../widgets/words'

import './styles.css';

function fetchJson(url) {
  return fetch(url).then(response => response.json())
}

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      party: {},
      voteSummary: {
        voteSummary: {},
        votePercentages: {},
      },
      subjectSummary: {
        standsTaken: [],
        idle: [],
        away: [],
      },
      nouns: [],
    }
  }

  componentDidMount() {
    const { partyId } = this.props.params

    const partyUrl = `${apiUrl}/api/parties/${partyId}`
    fetchJson(partyUrl)
      .then(party => this.setState({ party }))
      .catch(error => console.log(error))

    const voteUrl = `${apiUrl}/api/summary/votes/party/${partyId}`
    fetchJson(voteUrl)
      .then(voteSummary => this.setState({ voteSummary }))
      .catch(error => console.log(error))

    // const subjectUrl = `http://localhost:8080/api/summary/subjects/party/${partyId}`
    // fetchJson(subjectUrl)
    //   .then(subjectSummary => this.setState({ subjectSummary }))
    //   .catch(error => console.log(error))
    //
    const nounUrl = `${apiUrl}/api/summary/nouns/party/${partyId}`
    fetchJson(nounUrl)
      .then(nouns => this.setState({ nouns }))
      .catch(error => console.log(error))
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
