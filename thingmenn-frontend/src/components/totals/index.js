import React from 'react'

import totalsService from '../../services/totals-service'
import { formatPercentage, formatTime } from '../../utils'

import Friends from '../../widgets/friends'
import DetailsMenu from '../../widgets/details-menu'

import './styles.css'

export default class Totals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      terms: [],
      termsLookup: {},
      topMpsAttendance: [],
      bottomMpsAttendance: [],
      topMpsStands: [],
      bottomMpsStands: [],
      topMpMinutesTalked: [],
      bottomMpMinutesTalked: [],
    }
  }

  componentWillMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.routeParams)
  }

  getData(nextParams) {
    const params = nextParams || this.props.params

    totalsService.getTerms().then((terms) => {
      const termsLookup = {}
      terms.forEach((term) => (termsLookup[term.id] = term))
      this.setState(() => ({
        terms,
        termsLookup,
      }))
    })

    totalsService
      .getTopMpsAttendance(params)
      .then((topMpsAttendance) => {
        this.setState(() => ({ topMpsAttendance }))
      })

    totalsService
      .getBottomMpsAttendance(params)
      .then((bottomMpsAttendance) => {
        this.setState(() => ({ bottomMpsAttendance }))
      })

    totalsService.getTopMpsStands(params).then((topMpsStands) => {
      this.setState(() => ({ topMpsStands }))
    })

    totalsService
      .getBottomMpsStands(params)
      .then((bottomMpsStands) => {
        this.setState(() => ({ bottomMpsStands }))
      })

    totalsService
      .getTopMpsMinutes(params)
      .then((topMpMinutesTalked) => {
        this.setState(() => ({ topMpMinutesTalked }))
      })

    totalsService
      .getBottomMpsMinutes(params)
      .then((bottomMpMinutesTalked) => {
        this.setState(() => ({ bottomMpMinutesTalked }))
      })
  }

  generateTermsList(terms) {
    if (!terms.length) {
      return []
    }

    return terms.map((term) => ({
      name: term.id,
      url: `/samantekt/kjortimabil/${term.id}`,
    }))
  }

  render() {
    const {
      terms,
      termsLookup,
      topMpsAttendance,
      bottomMpsAttendance,
      topMpsStands,
      bottomMpsStands,
      topMpMinutesTalked,
      bottomMpMinutesTalked,
    } = this.state

    return (
      <div className="fill">
        <DetailsMenu
          menuItems={this.generateTermsList(terms, termsLookup)}
        />

        <div className="Details">
          <div className="Details-item">
            <Friends
              title="Besta mæting"
              subTitle="Mæting"
              friends={topMpsAttendance}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.attendance)}
              smallPrint="* atkvæðagreiðslur"
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Versta mæting"
              subTitle="Mæting"
              friends={bottomMpsAttendance}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.attendance)}
              smallPrint="* atkvæðagreiðslur"
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Mesta afstaða"
              subTitle="Afstaða"
              friends={topMpsStands}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.standsTaken)}
              smallPrint="* atkvæðagreiðslur"
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Minnsta afstaða"
              subTitle="Afstaða"
              friends={bottomMpsStands}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.standsTaken)}
              smallPrint="* atkvæðagreiðslur"
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Mest í ræðustól"
              subTitle="Tími"
              friends={topMpMinutesTalked}
              icon={false}
              valueFormatter={(friend) => formatTime(friend.minutesTalked)}
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Minnst í ræðustól"
              subTitle="Tími"
              friends={bottomMpMinutesTalked}
              icon={false}
              valueFormatter={(friend) => formatTime(friend.minutesTalked)}
            />
          </div>
        </div>
      </div>
    )
  }
}
