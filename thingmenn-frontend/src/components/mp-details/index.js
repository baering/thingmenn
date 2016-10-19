import React from 'react';
import 'whatwg-fetch'

import { apiUrl } from '../../config'
import MpHeader from '../../widgets/mp-header'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'

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
      subjectSummary: {
        standsTaken: [],
        idle: [],
        away: [],
      },
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
      subjectSummary,
      nouns,
      similarMps,
      differentMps,
    } = this.state

    return (
      <div>
        <MpHeader voteSummary={voteSummary} {...mp} />

        <div className='MpDetails'>
          <div className="MpDetails-item">
            <Piechart voteSummary={voteSummary} />
          </div>

          <div className="MpDetails-item">
            <h3 className='heading'>Mest talað um</h3>
            <ul>
              {nouns.slice(0, 10).map(noun => (
                <div className='text' key={noun.noun}>
                  <strong>{noun.noun}</strong>: {noun.occurance}
                </div>
              ))}
            </ul>
          </div>

          <div className="MpDetails-item">
            <h3 className='heading'>Mest afstaða</h3>
            <ul>
              {subjectSummary.standsTaken.slice(0, 8).map(subject => (
                <div className='text' key={subject.word}>
                  <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
                </div>
              ))}
            </ul>
          </div>

          <div className="MpDetails-item">
            <h3 className='heading'>Mest fjarverandi</h3>
            <ul>
              {subjectSummary.away.slice(0, 8).map(subject => (
                <div className='text' key={subject.word}>
                  <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
                </div>
              ))}
            </ul>
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
        </div>
      </div>
    );
  }
}
