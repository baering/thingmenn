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

export default class MpDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mp: { description: {}, terms: [] },
      params: {},
      terms: [],
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
    this.getData(nextProps.routeParams.mpId, nextProps.routeParams)
  }

  getData(id, nextParams) {
    // TODO: HOC withData that injects correct props into components

    const mpId = id || this.props.params.mpId
    const params = nextParams || this.props.params

    if (this.state.mp.id === mpId) return

    mpService.getMpDetails(mpId, params).then((mp) => {
      this.setState(() => ({
        mp,
      }))
    })

    mpSummaryService
      .getMpVoteSummary(mpId, params)
      .then((voteSummary) => {
        this.setState(() => ({
          voteSummary,
        }))
      })

    mpSummaryService
      .getMpSpeechSummary(mpId, params)
      .then((speechSummary) => {
        this.setState(() => ({
          speechSummary,
        }))
      })

    mpSummaryService
      .getMpDocumentSummary(mpId, params)
      .then((documentSummary) => {
        this.setState(() => ({
          documentSummary,
        }))
      })

    mpSummaryService
      .getMpVotePositions(mpId, params)
      .then((votePositions) => {
        this.setState(() => ({
          votePositions,
        }))
      })

    mpSummaryService
      .getMpSpeechPositions(mpId, params)
      .then((speechPositions) => {
        this.setState(() => ({
          speechPositions,
        }))
      })

    mpSummaryService
      .getMpDocumentPositions(mpId, params)
      .then((documentPositions) => {
        this.setState(() => ({
          documentPositions,
        }))
      })

    mpSummaryService
      .getMpAbsentSummary(mpId, params)
      .then((absentSummary) => {
        this.setState(() => ({
          absentSummary,
        }))
      })

    mpService.getSimilarMps(mpId, params).then((similarMps) => {
      this.setState(() => ({
        similarMps,
      }))
    })

    mpService.getDifferentMps(mpId, params).then((differentMps) => {
      this.setState(() => ({
        differentMps,
      }))
    })

    totalsService.getTerms().then((terms) => {
      this.setState(() => ({
        terms,
      }))
    })
  }

  generateTermsList(mp, terms) {
    const initialList = [
      {
        name: 'Samtölur',
        url: `/thingmenn/${mp.id}/kjortimabil/allt`,
      },
    ]

    if (!mp.terms || !mp.terms.length || !terms.length) {
      return initialList
    }

    const termsFormatted = mp.terms.map((termInfo) => ({
      name: termInfo.id,
      url: `/thingmenn/${mp.id}/kjortimabil/${termInfo.id}`,
    }))

    return initialList.concat(termsFormatted)
  }

  getDividerSize(tabName, params) {
    if (params.term === 'allt' || params.lthing === 'allt') {
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
      terms,
      voteSummary,
      speechSummary,
      documentSummary,
      votePositions,
      speechPositions,
      documentPositions,
      similarMps,
      differentMps,
    } = this.state

    const { params } = this.props

    return (
      <div className="fill">
        <DetailsMenu
          menuItems={this.generateTermsList(mp, terms)}
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
              params={params}
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
                        divider={this.getDividerSize('speeches', params)}
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
                        divider={this.getDividerSize('documents', params)}
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
