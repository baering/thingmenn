import React from 'react'
import './styles.css'

const Speeches = ({
  title,
  speechSummary,
}) => {

  const { Ræða, Andsvar, Flutningsræða} = speechSummary
  const explainData = speechSummary['Grein fyrir atkvæði']
  const discussData = speechSummary['Um atkvæðagreiðslu']
  const delayData = speechSummary['Um fundarstjórn']

  const fixTime = (timeValue) => {
    let minutes = parseFloat(timeValue)
    let timeString = 0;
    if (minutes !== 0) {
      if (minutes <= 60) {
        timeString = `${Math.round(minutes)}min`;
      } else {
        timeString = `${parseFloat(minutes/60).toFixed(1)}klst`;
      }
    } else {
      timeString = `Aldrei`;
    }
    return timeString;
  }

  let speech = {
    time: 0,
    count: 0
  }

  if (Ræða) {
    speech.time = fixTime(Ræða.minutes)
    speech.count = Ræða.count
  }

  let answer = {
    time: 0,
    count: 0
  }

  if (Andsvar) {
    answer.time = fixTime(Andsvar.minutes)
    answer.count = Andsvar.count
  }

  let billProposals = {
    time: 0,
    count: 0
  }

  if (Flutningsræða) {
    billProposals.time = fixTime(Flutningsræða.minutes)
    billProposals.count = Flutningsræða.count
  }

  let explainVote = {
    time: 0,
    count: 0
  }

  if (explainData) {
    explainVote.time = fixTime(explainData.minutes)
    explainVote.count = explainData.count
  }

  let discussVoting = {
    time: 0,
    count: 0
  }

  if (discussData) {
    discussVoting.time = fixTime(discussData.minutes)
    discussVoting.count = discussData.count
  }

  let delayVote = {
    time: 0,
    count: 0
  }

  if (delayData) {
    delayVote.time = fixTime(delayData.minutes)
    delayVote.count = delayData.count
  }

  return (
    <div className="Speeches">
     <h3 className='Speeches-heading heading'>{title}</h3>
     <div className="Speeches-items">
      <div className="Speeches-item">
        <p className="Speeches-statsText">{speech.time}</p>
        <h1 className="Speeches-statsHeading">{speech.count} Ræður</h1>
      </div>
      <div className="Speeches-item">
        <p className="Speeches-statsText">{answer.time}</p>
        <h1 className="Speeches-statsHeading">{answer.count} Andsvör</h1>
      </div>
      <div className="Speeches-item">
        <p className="Speeches-statsText">{billProposals.time}</p>
        <h1 className="Speeches-statsHeading">{billProposals.count} Flutningsræður</h1>
      </div>
      <div className="Speeches-item">
        <p className="Speeches-statsText">{explainVote.time}</p>
        <h1 className="Speeches-statsHeading">Grein fyrir atkvæði</h1>
      </div>
      <div className="Speeches-item">
        <p className="Speeches-statsText">{discussVoting.time}</p>
        <h1 className="Speeches-statsHeading">Um atkvæðagreiðslu</h1>
      </div>
      <div className="Speeches-item">
        <p className="Speeches-statsText">{delayVote.time}</p>
        <h1 className="Speeches-statsHeading">Um fundarstjórn</h1>
      </div>
     </div>
   </div>
  )
}

Speeches.propTypes = {
  title: React.PropTypes.string,
  speechSummary: React.PropTypes.object,
}

export default Speeches
