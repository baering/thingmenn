import React from 'react';

import mpService from '../../services/mp-service'
import mpSummaryService from '../../services/mp-summary-service'

import ColorLegend from '../../widgets/color-legend'
import DetailsHeader from '../../widgets/details-header'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'

import './styles.css'

export default class Mps extends React.Component {
  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.mpId !== this.props.params.mpId) {
      this.getData()
    }
  }

  async getData(id) {
    const { mpId } = this.props.params

    const [mp, voteSummary, subjectSummary, nouns, speechSummary, similarMps, differentMps] =
        await Promise.all([
          mpService.getMpDetails(mpId),
          mpSummaryService.getMpVotes(mpId),
          mpSummaryService.getMpSubjects(mpId),
          mpSummaryService.getMpNouns(mpId),
          mpSummaryService.getMpSpeeches(mpId),
          mpService.getSimilarMps(mpId),
          mpService.getDifferentMps(mpId),
        ])

    this.setState({
      mp,
      voteSummary,
      subjectSummary,
      nouns,
      speechSummary,
      similarMps,
      differentMps
    })
  }

  render() {
    if (!this.state) {
      return null
    }

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
      <div className="fill">
        <DetailsHeader speechSummary={speechSummary} voteSummary={voteSummary} {...mp} />

        <div className='Details'>
          <div className="Details-item">
          <h1 className="heading">Skipting atkvæða</h1>
            <Piechart voteSummary={voteSummary} />
            <ColorLegend includeAbsent={true} />
          </div>

          <div className="Details-item">
            <Words divider="3" title="Mest talað um" words={nouns} />
          </div>

          <div className="Details-item Details-item--large">
            <Speeches title="Skipting ræðutíma" speechSummary={speechSummary} />
          </div>

          <div className="Details-item">
            <Friends
              title="Samherjar"
              subTitle="Eins greidd atkvæði"
              friends={similarMps.slice(0, 10)}
              isDisplayingFriends={true}
            />
          </div>

          <div className="Details-item">
            <Friends
              title="Mótherjar"
              subTitle="Ólík greidd atkvæði"
              friends={differentMps.slice(0, 10)}
            />
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
