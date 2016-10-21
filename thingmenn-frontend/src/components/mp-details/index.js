import React from 'react';

import MpService from '../../services/mp-service'
import MpSummaryService from '../../services/mp-summary-service'

import ColorLegend from '../../widgets/color-legend'
import DetailsHeader from '../../widgets/details-header'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'

import './styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.mpService = new MpService()
    this.mpSummaryService = new MpSummaryService()

    const { mpId } = this.props.params

    this.state = {
      mp: this.mpService.getMpDetailsIfCached(mpId),
      voteSummary: this.mpSummaryService.getMpVotesIfCached(mpId),
      speechSummary: this.mpSummaryService.getMpSpeechesIfCached(mpId),
      subjectSummary: this.mpSummaryService.getMpSubjectsIfCached(mpId),
      nouns: this.mpSummaryService.getMpNounsIfCached(mpId),
      similarMps: this.mpService.getSimilarMpsIfCached(mpId),
      differentMps: this.mpService.getDifferentMpsIfCached(mpId),
    }
  }

  componentDidMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.routeParams.mpId)
  }

  getData(id) {
    const mpId = id || this.props.params.mpId

    if (this.state.mp.id === mpId) return;

    this.mpService.getMpDetails(mpId)
      .then(mp => {
        this.setState({ mp })
      })

    this.mpSummaryService.getMpVotes(mpId)
      .then(voteSummary => {
        this.setState({ voteSummary })
      })

    this.mpSummaryService.getMpSubjects(mpId)
      .then(subjectSummary => {
        this.setState({ subjectSummary })
      })

    this.mpSummaryService.getMpNouns(mpId)
      .then(nouns => {
        this.setState({ nouns })
      })

    this.mpSummaryService.getMpSpeeches(mpId)
      .then(speechSummary => {
        this.setState({ speechSummary })
      })

    this.mpService.getSimilarMps(mpId)
      .then(similarMps => {
        this.setState({ similarMps })
      })

    this.mpService.getDifferentMps(mpId)
      .then(differentMps => {
        this.setState({ differentMps })
      })
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
      <div className="fill">
        <DetailsHeader speechSummary={speechSummary} voteSummary={voteSummary} {...mp} />

        <div className='Details'>
          <div className="Details-item">
          <h1 className="heading">Skipting atkvæða</h1>
            <Piechart voteSummary={voteSummary} />
            <ColorLegend/>
          </div>

          <div className="Details-item">
            <Words divider="1.5" title="Mest talað um" words={nouns} />
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
