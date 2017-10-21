// TODO: Create a HOC instead of copying mp-details.

import React from 'react'

import mpService from '../../services/mp-service'
import mpSummaryService from '../../services/mp-summary-service'

import KPI from '../../widgets/key-performance-indicator'
import Topics from '../../widgets/topics'
import Topic from '../../widgets/topics/topic'
import ColorLegend from '../../widgets/color-legend'
import DetailsHeader from '../../widgets/details-header'
import DetailsMenu from '../../widgets/details-menu'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Words from '../../widgets/words'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'

import '../mp-details/styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mp: [],
      voteSummary: { votePercentages: [], voteSummary: [] },
      speechSummary: {},
      subjectSummary: [],
      nouns: [],
      similarMps: [],
      differentMps: [],
    }
  }

  componentWillMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.routeParams.mpId)
  }

  getData(id) {
    const mpId = id || this.props.params.mpId

    if (this.state.mp.id === mpId) return

    mpService.getMpDetails(mpId).then(mp => {
      this.setState({ mp })
    })

    mpSummaryService.getMpVotes(mpId).then(voteSummary => {
      this.setState({ voteSummary })
    })

    mpSummaryService.getMpSubjects(mpId).then(subjectSummary => {
      this.setState({ subjectSummary })
    })

    mpSummaryService.getMpNouns(mpId).then(nouns => {
      this.setState({ nouns })
    })

    mpSummaryService.getMpSpeeches(mpId).then(speechSummary => {
      this.setState({ speechSummary })
    })

    mpService.getSimilarMps(mpId).then(similarMps => {
      this.setState({ similarMps })
    })

    mpService.getDifferentMps(mpId).then(differentMps => {
      this.setState({ differentMps })
    })
  }

  render() {
    const {
      activeTab,
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
        <DetailsMenu />
        <DetailsHeader {...mp} />
        <div className="Details">
          <KPI speechSummary={speechSummary} voteSummary={voteSummary} />
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
            <Topics>
              {( activeTab ) => (
                <span>
                  <Topic active={activeTab === 0}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting ræðutíma </h1>
                      <Speeches speechSummary={speechSummary} />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Mest talað um</h1>
                      <Words divider="3" words={nouns} />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">
                        Atkvæðaskipting eftir efnisflokkum
                      </h1>
                      <ColorLegend />
                      {subjectSummary.map(subject => (
                        <BarChart
                          subjectSummary={subject}
                          key={subject.subject}
                        />
                      ))}
                    </div>
                  </Topic>
                  <Topic active={activeTab === 1}>
                    <div className="Topic-column">
                      <Piechart voteSummary={voteSummary} />
                      <ColorLegend includeAbsent />
                    </div>
                  </Topic>
                  <Topic active={activeTab === 2}>
                    <div className="Topic-column">Nothing</div>
                  </Topic>
                </span>
              )}
            </Topics>
          </div>
        </div>
      </div>
    )
  }
}
