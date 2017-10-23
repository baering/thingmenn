import React from 'react';

import totalsService from '../../services/totals-service'
import { formatPercentage, formatTime } from '../../utils'

import Friends from '../../widgets/friends'

import './styles.css'

export default class Totals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      topMpsAttendance: [],
      bottomMpsAttendance: [],
      topMpsStands: [],
      bottomMpsStands: [],
      topMpMinutesTalked: [],
      bottomMpMinutesTalked: [],
    }
  }

  componentDidMount() {
    const lthing = 147
    totalsService.getTopMpsAttendanceByLthing(lthing)
      .then(topMpsAttendance => {
        this.setState({ topMpsAttendance })
      })

    totalsService.getBottomMpsAttendanceByLthing(lthing)
      .then(bottomMpsAttendance => {
        this.setState({ bottomMpsAttendance })
      })

    totalsService.getTopMpsStandsByLthing(lthing)
      .then(topMpsStands => {
        this.setState({ topMpsStands })
      })

    totalsService.getBottomMpsStandsByLthing(lthing)
      .then(bottomMpsStands => {
        this.setState({ bottomMpsStands })
      })

    totalsService.getTopMpsMinutesByLthing(lthing)
      .then(topMpMinutesTalked => {
        this.setState({ topMpMinutesTalked })
      })

    totalsService.getBottomMpsMinutesByLthing(lthing)
      .then(bottomMpMinutesTalked => {
        this.setState({ bottomMpMinutesTalked })
      })
  }

  render() {
    const {
      topMpsAttendance,
      bottomMpsAttendance,
      topMpsStands,
      bottomMpsStands,
      topMpMinutesTalked,
      bottomMpMinutesTalked,
    } = this.state

    return (
      <div className="fill">
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
