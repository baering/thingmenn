import React from 'react'

import mpService from '../../services/mp-service'
import totalsService from '../../services/totals-service'
import mpSummaryService from '../../services/mp-summary-service'

import KPI from '../../widgets/key-performance-indicator'
import Topics from '../../widgets/topics'
import Topic from '../../widgets/topics/topic'
import ColorLegend from '../../widgets/color-legend'
import DetailsHeader from '../../widgets/details-header'
import DetailsMenu from '../../widgets/details-menu'
import Friends from '../../widgets/friends'
import Piechart from '../../widgets/piechart'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'
import Items from '../../widgets/items'

import '../mp-details/styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mp: { description: {}, lthings: [] },
      lthing: null,
      lthings: [],
      lthingLookup: {},
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
        mp,
      }))
    })

    mpSummaryService
      .getMpVoteSummaryByLthing(mpId, lthingId)
      .then(voteSummary => {
        this.setState(() => ({
          voteSummary,
        }))
      })

    mpSummaryService
      .getMpSpeechSummaryByLthing(mpId, lthingId)
      .then(speechSummary => {
        this.setState(() => ({
          speechSummary,
        }))
      })

    mpSummaryService
      .getMpDocumentSummaryByLthing(mpId, lthingId)
      .then(documentSummary => {
        this.setState(() => ({
          documentSummary,
        }))
      })

    mpSummaryService
      .getMpVotePositionsByLthing(mpId, lthingId)
      .then(votePositions => {
        this.setState(() => ({
          votePositions,
        }))
      })

    mpSummaryService
      .getMpSpeechPositionsByLthing(mpId, lthingId)
      .then(speechPositions => {
        this.setState(() => ({
          speechPositions,
        }))
      })

    mpSummaryService
      .getMpDocumentPositionsByLthing(mpId, lthingId)
      .then(documentPositions => {
        this.setState(() => ({
          documentPositions,
        }))
      })

    mpService.getSimilarMpsByLthing(mpId, lthingId).then(similarMps => {
      this.setState(() => ({
        similarMps,
      }))
    })

    mpService.getDifferentMpsByLthing(mpId, lthingId).then(differentMps => {
      this.setState(() => ({
        differentMps,
      }))
    })

    totalsService.getLthings().then(lthings => {
      const lthingLookup = {}
      lthings.forEach(lthing => lthingLookup[lthing.id] = lthing)
      this.setState(() => ({
        lthings,
        lthingLookup,
      }))
    })
  }

  generateLthingList(mp, lthings, lthingLookup) {
    const initialList = [
      {
        name: 'Samtölur',
        url: `/thingmenn/${mp.id}/thing/allt`,
      }
    ]

    if (!mp.lthings.length || !lthings.length) {
      return initialList
    }

    const lthingsFormatted = mp.lthings.map(lthingInfo => ({
      year: lthingLookup[lthingInfo.lthing].start.split('.')[2],
      thing: lthingInfo.lthing,
      url: `/thingmenn/${mp.id}/thing/${lthingInfo.lthing}`
    }))

    return initialList.concat(lthingsFormatted)
  }

  render() {
    const {
      mp,
      lthing,
      lthings,
      lthingLookup,
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
        <DetailsMenu menuItems={this.generateLthingList(mp, lthings, lthingLookup)} />
        <DetailsHeader {...mp} description={mp.description.asMp} />
        <div className="Details">
          <KPI
            voteSummary={voteSummary}
            speechSummary={speechSummary}
            documentSummary={documentSummary}
          />
          <div className="Details-item">
            <Friends
              title="Samherjar"
              subTitle="Eins greidd atkvæði"
              friends={similarMps.slice(0, 10)}
              lthing={lthing}
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
          <div className="Details-item Details-item--large Details-item--no-padding">
            <Topics>
              {activeTab => (
                <span>
                  <Topic active={activeTab === 0}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">
                        Skipting atkvæða eftir flokkum
                      </h1>
                      <ColorLegend />
                      {votePositions.map(sectionSummary => (
                        <BarChart
                          sectionSummary={sectionSummary}
                          key={sectionSummary.name}
                        />
                      ))}
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting atkvæða</h1>

                      <Piechart voteSummary={voteSummary} />
                      <ColorLegend includeAbsent />
                    </div>
                  </Topic>
                  <Topic active={activeTab === 1}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Ræður eftir flokkum</h1>
                      <Items divider={3} items={speechPositions} />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting ræðutíma</h1>
                      <Speeches speechSummary={speechSummary} />
                    </div>
                  </Topic>
                  <Topic active={activeTab === 2}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Þingskjöl eftir flokkum</h1>
                      <Items divider={0.4} items={documentPositions} />
                    </div>
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
