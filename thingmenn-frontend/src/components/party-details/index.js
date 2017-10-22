import React from 'react'

import partyService from '../../services/party-service'
import totalsService from '../../services/totals-service'
import partySummaryService from '../../services/party-summary-service'

import KPI from '../../widgets/key-performance-indicator'
import Topics from '../../widgets/topics'
import Topic from '../../widgets/topics/topic'
import ColorLegend from '../../widgets/color-legend'
import DetailsHeader from '../../widgets/details-header'
import DetailsMenu from '../../widgets/details-menu'
import Piechart from '../../widgets/piechart'
import Speeches from '../../widgets/speeches'
import BarChart from '../../widgets/bar-chart'
import Items from '../../widgets/items'

import './styles.css'

export default class PartyDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      party: { lthings: [] },
      lthing: null,
      lthings: [],
      lthingLookup: {},
      voteSummary: { votePercentages: [], voteSummary: [] },
      speechSummary: [],
      documentSummary: [],
      votePositions: [],
      speechPositions: [],
      documentPositions: [],
    }
  }


  componentDidMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.routeParams.partyId, nextProps.routeParams.lthing)
  }

  getData(id, lthing) {
    const partyId = id || this.props.params.partyId
    const lthingId = lthing || this.props.params.lthing

    partyService.getPartyDetailsByLthing(partyId, 'allt').then(party => {
      this.setState(() => ({ party }))
    })

    partySummaryService
      .getPartyVoteSummaryByLthing(partyId, lthingId)
      .then(voteSummary => {
        this.setState(() => ({
          voteSummary,
        }))
      })

    partySummaryService
      .getPartySpeechSummaryByLthing(partyId, lthingId)
      .then(speechSummary => {
        this.setState(() => ({
          speechSummary,
        }))
      })

    partySummaryService
      .getPartyDocumentSummaryByLthing(partyId, lthingId)
      .then(documentSummary => {
        this.setState(() => ({
          documentSummary,
        }))
      })

    partySummaryService
      .getPartyVotePositionsByLthing(partyId, lthingId)
      .then(votePositions => {
        this.setState(() => ({
          votePositions,
        }))
      })

    partySummaryService
      .getPartySpeechPositionsByLthing(partyId, lthingId)
      .then(speechPositions => {
        this.setState(() => ({
          speechPositions,
        }))
      })

    partySummaryService
      .getPartyDocumentPositionsByLthing(partyId, lthingId)
      .then(documentPositions => {
        this.setState(() => ({
          documentPositions,
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

  generateLthingList(party, lthings, lthingLookup) {
    const initialList = [
      {
        name: 'Samtölur',
        url: `/thingflokkar/${party.id}/thing/allt`,
      }
    ]

    if (!party.lthings.length || !lthings.length) {
      return initialList
    }

    const lthingsFormatted = party.lthings.map(lthingInfo => ({
      year: lthingLookup[lthingInfo.lthing].start.split('.')[2],
      thing: lthingInfo.lthing,
      url: `/thingflokkar/${party.id}/thing/${lthingInfo.lthing}`
    }))

    return initialList.concat(lthingsFormatted)
  }

  render() {
    const {
      party,
      lthing,
      lthings,
      lthingLookup,
      voteSummary,
      speechSummary,
      documentSummary,
      votePositions,
      speechPositions,
      documentPositions,
    } = this.state

    return (
      <div className="fill">
        <DetailsMenu menuItems={this.generateLthingList(party, lthings, lthingLookup)}/>
        <DetailsHeader
          speechSummary={speechSummary}
          voteSummary={voteSummary}
          id={party.id}
          mpName={party.name}
          description={party.about}
          imagePath={party.imagePath}
        />

        <div className="Details">
          <KPI
            voteSummary={voteSummary}
            speechSummary={speechSummary}
            documentSummary={documentSummary}
          />

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
                      <Items divider={15} items={speechPositions} />
                    </div>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Skipting ræðutíma</h1>
                      <Speeches speechSummary={speechSummary} />
                    </div>
                  </Topic>
                  <Topic active={activeTab === 2}>
                    <div className="Topic-column">
                      <h1 className="Topic-heading">Þingskjöl eftir flokkum</h1>
                      <Items divider={3} items={documentPositions} />
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
