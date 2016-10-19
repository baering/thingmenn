import React from 'react';
import 'whatwg-fetch'

import MpHeader from '../../widgets/mp-header'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Words from '../../widgets/words'

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
      similar: [],
    }
  }

  componentDidMount() {
    const { mpId } = this.props.params

    const mpUrl = `http://api-dot-thingmenn.appspot.com/api/mps/${mpId}`
    fetchJson(mpUrl)
      .then(mp => this.setState({ mp }))
      .catch(error => console.log(error))

    const mpVoteUrl = `http://api-dot-thingmenn.appspot.com/api/summary/votes/mp/${mpId}`
    fetchJson(mpVoteUrl)
      .then(voteSummary => this.setState({ voteSummary }))
      .catch(error => console.log(error))

    const mpSubjectUrl = `http://api-dot-thingmenn.appspot.com/api/summary/subjects/mp/${mpId}`
    fetchJson(mpSubjectUrl)
      .then(subjectSummary => this.setState({ subjectSummary }))
      .catch(error => console.log(error))

    const mpNounUrl = `http://api-dot-thingmenn.appspot.com/api/summary/nouns/mp/${mpId}`
    fetchJson(mpNounUrl)
      .then(nouns => this.setState({ nouns }))
      .catch(error => console.log(error))

    const mpSimilarUrl = `http://api-dot-thingmenn.appspot.com/api/mps/${mpId}/similar`
    fetchJson(mpSimilarUrl)
      .then(similar => this.setState({ similar }))
      .catch(error => console.log(error))
  }

  render() {
    const { mp, voteSummary, subjectSummary, nouns, similar } = this.state

    return (
      <div>
        <MpHeader voteSummary={voteSummary} {...mp} />

        <div className='MpDetails'>
          <div className="MpDetails-item">
            <Piechart voteSummary={voteSummary} />
          </div>

          <div className="MpDetails-item">
            <Words title="Mest talað um" words={nouns} />
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
            <Friends title="Samherjar" friends={similar.slice(0, 10)} />
          </div>

          <div className="MpDetails-item">
            <Friends title="Mótherjar" friends={similar.reverse().slice(0, 10)} />
          </div>
        </div>
      </div>
    );
  }
}
