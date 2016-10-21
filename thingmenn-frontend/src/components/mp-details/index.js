import React from 'react';
import 'whatwg-fetch'

import { apiUrl } from '../../config'
import ColorLegend from '../../widgets/color-legend'
import MpHeader from '../../widgets/mp-header'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'

import './styles.css'

function fetchJson(url) {
  return fetch(url).then(response => response.json())
}

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mp: {},
      voteSummary: {
        voteSummary: {},
        votePercentages: {},
      },
      speechSummary: {},
      subjectSummary: [],
      nouns: [],
      similarMps: [],
      differentMps: [],
    }
  }

  componentDidMount() {
    const { mpId } = this.props.params

    const mpUrl = `${apiUrl}/api/mps/${mpId}`
    fetchJson(mpUrl)
      .then(mp => this.setState({ mp }))
      .catch(error => console.log(error))

    const mpVoteUrl = `${apiUrl}/api/summary/votes/mp/${mpId}`
    fetchJson(mpVoteUrl)
      .then(voteSummary => this.setState({ voteSummary }))
      .catch(error => console.log(error))

    const mpSubjectUrl = `${apiUrl}/api/summary/subjects/mp/${mpId}`
    fetchJson(mpSubjectUrl)
      .then(subjectSummary => this.setState({ subjectSummary }))
      .catch(error => console.log(error))

    const mpSpeechUrl = `${apiUrl}/api/summary/speeches/mp/${mpId}`
    fetchJson(mpSpeechUrl)
      .then(speechSummary => this.setState({ speechSummary }))
      .catch(error => console.log(error))

    const mpNounUrl = `${apiUrl}/api/summary/nouns/mp/${mpId}`
    fetchJson(mpNounUrl)
      .then(nouns => this.setState({ nouns }))
      .catch(error => console.log(error))

    const mpSimilarUrl = `${apiUrl}/api/mps/${mpId}/similar`
    fetchJson(mpSimilarUrl)
      .then(similarMps => this.setState({ similarMps }))
      .catch(error => console.log(error))

    const mpDifferentUrl = `${apiUrl}/api/mps/${mpId}/different`
    fetchJson(mpDifferentUrl)
      .then(differentMps => this.setState({ differentMps }))
      .catch(error => console.log(error))
  }

  render() {
    const {
      mp,
      voteSummary,
      speechSummary,
      subjectSummary,
      nouns,
      similarMps,
      differentMps,
    } = this.state
    return (
      <div>
        <MpHeader speechSummary={speechSummary} voteSummary={voteSummary} {...mp} />

        <div className='MpDetails'>
          <div className="MpDetails-item">
            <Piechart voteSummary={voteSummary} />
            <ColorLegend/>
          </div>

          <div className="MpDetails-item">
            <Words title="Mest talað um" words={nouns} />
          </div>

          <div className="MpDetails-item MpDetails-item--large">
            <Speeches title="Skipting ræðutíma" speechSummary={speechSummary} />
          </div>

          <div className="MpDetails-item">
            <Friends
              title="Samherjar"
              subTitle="Eins greidd atkvæði"
              friends={similarMps.slice(0, 10)}
              isDisplayingFriends={true}
            />
          </div>

          <div className="MpDetails-item">
            <Friends
              title="Mótherjar"
              subTitle="Ólík greidd atkvæði"
              friends={differentMps.slice(0, 10)}
            />
          </div>

          <div className="MpDetails-item MpDetails-item--large">
            <h3 className='heading'>Atkvæðaskipting eftir efnisflokkum</h3>
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
