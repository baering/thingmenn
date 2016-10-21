import React from 'react';
import 'whatwg-fetch'

import { apiUrl } from '../../config'
import MpService from '../../services/mp-service'
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

    this.mpService = new MpService()
    const { mpId } = this.props.params

    this.state = {
      mp: this.mpService.getMpDetailsIfCached(mpId),
      voteSummary: {
        voteSummary: {},
        votePercentages: {},
      },
      speechSummary: {},
      subjectSummary: [],
      nouns: [],
      similarMps: this.mpService.getSimilarMpsIfCached(mpId),
      differentMps: this.mpService.getDifferentMpsIfCached(mpId),
    }
  }

  componentDidMount() {
    const { mpId } = this.props.params

    if (!this.state.mp.id) {
      this.mpService.getMpDetails(mpId)
        .then(mp => {
          this.setState({ mp })
        })
    }

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

    if (!this.state.similarMps.length) {
      this.mpService.getSimilarMps(mpId)
        .then(similarMps => {
          this.setState({ similarMps })
        })
    }

    if (!this.state.differentMps.length) {
      this.mpService.getDifferentMps(mpId)
        .then(differentMps => {
          this.setState({ differentMps })
        })
    }
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
          <h1 className="MpDetails-heading">Skipting atkvæða</h1>
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
            <h1 className='heading'>Atkvæðaskipting eftir efnisflokkum</h1>
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
