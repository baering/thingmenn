import React from 'react';
import 'whatwg-fetch'

import './styles.css';

function fetchJson(url) {
  console.log(`Fetching json: ${url}`)
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
      }
    }
  }

  componentDidMount() {
    const { mpId } = this.props.params

    const mpUrl = `http://localhost:8080/api/mps/${mpId}`
    fetchJson(mpUrl)
      .then(mp => this.setState({ mp }))
      .catch(error => console.log(error))

    const mpVoteUrl = `http://localhost:8080/api/summary/votes/mp/${mpId}`
    fetchJson(mpVoteUrl)
      .then(voteSummary => this.setState({ voteSummary }))
      .catch(error => console.log(error))

    const mpSubjectUrl = `http://localhost:8080/api/summary/subjects/mp/${mpId}`
    fetchJson(mpSubjectUrl)
      .then(subjectSummary => this.setState({ subjectSummary }))
      .catch(error => console.log(error))
  }

  render() {
    const { mp, voteSummary, subjectSummary } = this.state

    return (
      <div className='mp-details'>
        <div className='mp-details__introduction mp-details__section'>
          <div
            className='mp-details__introduction-image'
            style={{
              backgroundImage: `url(${mp.imagePath})`
            }}
          ></div>
          <div className='mp-details__introduction-text'>
            <h1 className='mp-details__introduction-name heading'>{mp.name}</h1>
            <h2 className='mp-details__introduction-party text'>{mp.party}</h2>
          </div>
        </div>

        <div className='mp-details__votes mp-details__section'>
          <h2 className='heading'>Yfirlit atkvæða</h2>
          <ul>
            <li className='text'>{voteSummary.voteSummary.numberOfVotes} atkvæði</li>
            <li className='text'>{voteSummary.votePercentages.standsTaken}% afstaða tekin</li>
            <li className='text'>{voteSummary.votePercentages.idle}% hlutleysi</li>
            <li className='text'>{voteSummary.votePercentages.away}% fjarverandi</li>
          </ul>
        </div>

        <div className='mp-details__subjects mp-details__section'>
          <h3 className='heading'>Mest afstaða</h3>
          <ul>
            {subjectSummary.standsTaken.slice(0, 5).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>

          <h3 className='heading'>Mest hlutleysi</h3>
          <ul>
            {subjectSummary.idle.slice(0, 5).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>

          <h3 className='heading'>Mest fjarverandi</h3>
          <ul>
            {subjectSummary.away.slice(0, 5).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
