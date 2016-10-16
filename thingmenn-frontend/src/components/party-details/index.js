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

    const partyUrl = `http://localhost:8080/api/parties/${partyId}`
    fetchJson(partyUrl)
      .then(party => this.setState({ party }))
      .catch(error => console.log(error))

    const voteUrl = `http://localhost:8080/api/summary/votes/party/${partyId}`
    fetchJson(voteUrl)
      .then(voteSummary => this.setState({ voteSummary }))
      .catch(error => console.log(error))

    // const subjectUrl = `http://localhost:8080/api/summary/subjects/party/${partyId}`
    // fetchJson(subjectUrl)
    //   .then(subjectSummary => this.setState({ subjectSummary }))
    //   .catch(error => console.log(error))
    //
    const nounUrl = `http://localhost:8080/api/summary/nouns/party/${partyId}`
    fetchJson(nounUrl)
      .then(nouns => this.setState({ nouns }))
      .catch(error => console.log(error))
  }

  render() {
    const { party, voteSummary, nouns } = this.state

    return (
      <div className='party-details'>
        <div className='party-details__introduction party-details__section'>
          <div className='party-details__introduction-text'>
            <h1 className='party-details__introduction-name heading'>{party.name}</h1>
            <h2 className='party-details__introduction-party text'>{party.party}</h2>
          </div>
        </div>

        <div className='party-details__votes party-details__section'>
          <h2 className='heading'>Yfirlit atkvæða</h2>
          <ul>
            <li className='text'>{voteSummary.voteSummary.numberOfVotes} atkvæði</li>
            <li className='text'>{voteSummary.votePercentages.standsTaken}% afstaða tekin</li>
            <li className='text'>{voteSummary.votePercentages.idle}% hlutleysi</li>
            <li className='text'>{voteSummary.votePercentages.away}% fjarverandi</li>
          </ul>
        </div>

        <div className='party-details__nouns party-details__section'>
          <h3 className='heading'>Mest talað um</h3>
          <ul>
            {nouns.slice(0, 10).map(noun => (
              <div className='text' key={noun.noun}>
                <strong>{noun.noun}</strong>: {noun.occurance} skipti
              </div>
            ))}
          </ul>
        </div>

        {/* <div className='party-details__subjects party-details__section'>
          <h3 className='heading'>Mest afstaða</h3>
          <ul>
            {subjectSummary.standsTaken.slice(0, 8).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>

          <h3 className='heading'>Mest hlutleysi</h3>
          <ul>
            {subjectSummary.idle.slice(0, 8).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>

          <h3 className='heading'>Mest fjarverandi</h3>
          <ul>
            {subjectSummary.away.slice(0, 8).map(subject => (
              <div className='text' key={subject.word}>
                <strong>{subject.word}</strong>: {subject.occurance} ({subject.occuranceRatio}%)
              </div>
            ))}
          </ul>
        </div> */}
      </div>
    );
  }
}
