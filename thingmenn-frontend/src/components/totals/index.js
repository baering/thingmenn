import React from 'react';

import totalsService from '../../services/totals-service'
import { formatPercentage, formatTime } from '../../utils'

import Friends from '../../widgets/friends'
import DetailsMenu from '../../widgets/details-menu'

import './styles.css'

export default class Totals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lthings: [],
      lthingLookup: {},
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
    this.getData(nextProps.routeParams.lthing)
  }

  getData(lthing) {
    const lthingId = lthing || this.props.params.lthing

    totalsService.getLthings()
      .then(lthings => {
        const lthingLookup = {}
        lthings.forEach(lthing => lthingLookup[lthing.id] = lthing)
        this.setState(() => ({
          lthings,
          lthingLookup,
        }))
      })


    totalsService.getTopMpsAttendanceByLthing(lthingId)
      .then(topMpsAttendance => {
        this.setState(() => ({ topMpsAttendance }))
      })

    totalsService.getBottomMpsAttendanceByLthing(lthingId)
      .then(bottomMpsAttendance => {
        this.setState(() => ({ bottomMpsAttendance }))
      })

    totalsService.getTopMpsStandsByLthing(lthingId)
      .then(topMpsStands => {
        this.setState(() => ({ topMpsStands }))
      })

    totalsService.getBottomMpsStandsByLthing(lthingId)
      .then(bottomMpsStands => {
        this.setState(() => ({ bottomMpsStands }))
      })

    totalsService.getTopMpsMinutesByLthing(lthingId)
      .then(topMpMinutesTalked => {
        this.setState(() => ({ topMpMinutesTalked }))
      })

    totalsService.getBottomMpsMinutesByLthing(lthingId)
      .then(bottomMpMinutesTalked => {
        this.setState(() => ({ bottomMpMinutesTalked }))
      })
  }

  generateLthingList(lthings) {
    if (!lthings.length) {
      return []
    }

    return lthings.slice(1, lthings.length).map(lthing => ({
      year: lthing.start.split('.')[2],
      thing: lthing.id,
      url: `/samantekt/thing/${lthing.id}`
    }))
  }

  render() {
    const {
      lthings,
      lthingLookup,
      topMpsAttendance,
      bottomMpsAttendance,
      topMpsStands,
      bottomMpsStands,
      topMpMinutesTalked,
      bottomMpMinutesTalked,
    } = this.state

    return (
      <div className="fill">
        <DetailsMenu menuItems={this.generateLthingList(lthings, lthingLookup)} />
        <h1 className="title">Samantekt <span className="Totals-smallprint">Unnin úr árunum 2013-2016</span></h1>

        <div className="Details">
          <div className="Details-item">
            <Friends
              title="Besta mæting"
              subTitle="Mæting"
              friends={topMpsAttendance}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.attendance)}
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Versta mæting"
              subTitle="Mæting"
              friends={bottomMpsAttendance}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.attendance)}
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Mesta afstaða"
              subTitle="Afstaða"
              friends={topMpsStands}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.standsTaken)}
            />
          </div>
          <div className="Details-item">
            <Friends
              title="Minnsta afstaða"
              subTitle="Afstaða"
              friends={bottomMpsStands}
              icon={false}
              valueFormatter={(friend) => formatPercentage(friend.standsTaken)}
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
    );
  }
}
