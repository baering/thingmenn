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
import Documents from '../../widgets/documents'
import BarChart from '../../widgets/bar-chart'
import Items from '../../widgets/items'
import WeekdayHourMatrix from '../../widgets/weekday-hour-matrix'

import '../mp-details/styles.css'
import { generateLthingList } from '../../utility/periods'

export default class MpDetails extends React.Component {
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
      absentSummary: {},
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

    if (this.state.mp.id === mpId) return

    mpService.getMpDetails(mpId).then((mp) => {
      this.setState(() => ({
        mp,
      }))
    })

    // if (!this.state.mp.lthings.length) {
    //   return
    // }

    const lthingId = lthing || this.props.params.lthing

    mpSummaryService
      .getMpVoteSummaryByLthing(mpId, lthingId)
      .then((voteSummary) => {
        this.setState(() => ({
          voteSummary,
        }))
      })

    mpSummaryService
      .getMpSpeechSummaryByLthing(mpId, lthingId)
      .then((speechSummary) => {
        this.setState(() => ({
          speechSummary,
        }))
      })

    mpSummaryService
      .getMpDocumentSummaryByLthing(mpId, lthingId)
      .then((documentSummary) => {
        this.setState(() => ({
          documentSummary,
        }))
      })

    mpSummaryService
      .getMpVotePositionsByLthing(mpId, lthingId)
      .then((votePositions) => {
        this.setState(() => ({
          votePositions,
        }))
      })

    mpSummaryService
      .getMpSpeechPositionsByLthing(mpId, lthingId)
      .then((speechPositions) => {
        this.setState(() => ({
          speechPositions,
        }))
      })

    mpSummaryService
      .getMpDocumentPositionsByLthing(mpId, lthingId)
      .then((documentPositions) => {
        this.setState(() => ({
          documentPositions,
        }))
      })

    mpSummaryService
      .getMpAbsentSummaryByLthing(mpId, lthingId)
      .then((absentSummary) => {
        this.setState(() => ({
          absentSummary,
        }))
      })

    mpService.getSimilarMpsByLthing(mpId, lthingId).then((similarMps) => {
      this.setState(() => ({
        similarMps,
      }))
    })

    mpService.getDifferentMpsByLthing(mpId, lthingId).then((differentMps) => {
      this.setState(() => ({
        differentMps,
      }))
    })

    totalsService.getLthings().then((lthings) => {
      const lthingLookup = {}
      lthings.forEach((lthing) => (lthingLookup[lthing.id] = lthing))
      this.setState(() => ({
        lthings,
        lthingLookup,
      }))
    })
  }

  generateLthingList(mp, lthings, lthingLookup) {
    if (!mp.lthings.length || !lthings.length) {
      return []
    }

    const lthingsForMp = mp.lthings.map((lthingInfo) =>
      Number(lthingInfo.lthing),
    )

    return generateLthingList(
      lthingsForMp,
      lthings,
      lthingLookup,
      `thingmenn/${mp.id}`,
    )
  }

  getDividerSize(tabName, lthing) {
    if (lthing === 'allt') {
      if (tabName === 'speeches') {
        return 3
      } else if (tabName === 'documents') {
        return 0.4
      }
    }

    if (tabName === 'speeches') {
      return 0.5
    } else if (tabName === 'documents') {
      return 0.1
    }

    return 1
  }

  render() {
    const {
      mp,
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

    const lthing = this.props.params.lthing

    return (
      <div className="fill">
        <DetailsMenu
          menuItems={this.generateLthingList(mp, lthings, lthingLookup)}
        />
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
              lthing={lthing}
            />
          </div>
          <div className="Details-item Details-item--large Details-item--no-padding">
            <Topics>
              {(activeTab) => (
                <span>
                  <Topic active={activeTab === 0}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">
                        Skipting atkvæða eftir flokkum
                      </h1>
                      <ColorLegend />
                      {votePositions.map((sectionSummary) => (
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
                    {!!this.state.absentSummary &&
                      !!this.state.absentSummary.statistics && (
                        <div className="Topic-column">
                          <h1 className="Topic-heading">Hvenær fjarverandi</h1>

                          <WeekdayHourMatrix
                            weekdayHourMatrixSummary={this.state.absentSummary}
                          />
                        </div>
                      )}
                  </Topic>
                  <Topic active={activeTab === 1}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Ræður eftir flokkum</h1>
                      <Items
                        divider={this.getDividerSize('speeches', lthing)}
                        items={speechPositions}
                      />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting ræðutíma</h1>
                      <Speeches speechSummary={speechSummary} />
                    </div>
                  </Topic>
                  <Topic active={activeTab === 2}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Þingskjöl eftir flokkum</h1>
                      <Items
                        divider={this.getDividerSize('documents', lthing)}
                        items={documentPositions}
                      />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting þingskjala</h1>
                      <Documents documentSummary={documentSummary} />
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
