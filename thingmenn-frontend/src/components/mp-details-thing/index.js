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
      mp: {description: {}},
      lthing: null,
      voteSummary: { votePercentages: [], voteSummary: [] },
      speechSummary: [],
      documentSummary: [],
      votePositions: [],
      speechPositions: [],
      documentPositions: [],
      similarMps: [],
      differentMps: [],
    }
  }

  componentWillMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.routeParams.mpId, nextProps.routeParams.lthing)
  }

  getData(id, lthing) {
    // TODO: HOC withData that injects correct props into components

    const mpId = id || this.props.params.mpId
    const lthingId = lthing || this.props.params.lthing

    if (this.state.mp.id === mpId) return

    mpService.getMpDetailsByLthing(mpId, lthingId).then(mp => {
      this.setState(() => ({
        mp
      }))
    })
    
    mpSummaryService.getMpVoteSummaryByLthing(mpId, lthingId).then(voteSummary => {
      this.setState(() => ({
        voteSummary
      }))
    })
    
    mpSummaryService.getMpSpeechSummaryByLthing(mpId, lthingId).then(speechSummary => {
      this.setState(() => ({
        speechSummary
      }))
    })
    
    mpSummaryService.getMpDocumentSummaryByLthing(mpId, lthingId).then(documentSummary => {
      this.setState(() => ({
        documentSummary
      }))
    })
    
    mpSummaryService.getMpVotePositionsByLthing(mpId, lthingId).then(votePositions => {
      this.setState(() => ({
        votePositions
      }))

    })
    
    mpSummaryService.getMpSpeechPositionsByLthing(mpId, lthingId).then(speechPositions => {
      this.setState(() => ({
        speechPositions
      }))

    })
    
    mpSummaryService.getMpDocumentPositionsByLthing(mpId, lthingId).then(documentPositions => {
      this.setState(() => ({
        documentPositions
      }))

    })

    mpService.getSimilarMpsByLthing(mpId, lthingId).then(similarMps => {
      this.setState(() => ({
        similarMps
      }))
    })

    mpService.getDifferentMpsByLthing(mpId, lthingId).then(differentMps => {
      this.setState(() => ({
        differentMps
      }))
    })
  }

  render() {
    const {
      mp,
      lthing,
      voteSummary,
      speechSummary,
      documentSummary,
      votePositions,
      speechPositions,
      documentPositions,
      similarMps,
      differentMps,
    } = this.state

    return (
      <div className="fill">
        <DetailsMenu />
        <DetailsHeader {...mp} />
        <div className="Details">
          <KPI voteSummary={voteSummary} speechSummary={speechSummary} documentSummary={documentSummary}  />
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
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">
                        Atkvæðaskipting eftir efnisflokkum
                      </h1>
                      <ColorLegend />
                      {console.log(votePositions)}
                      {votePositions.map(sectionSummary => (
                        <BarChart
                          sectionSummary={sectionSummary}
                          key={sectionSummary.name}
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
