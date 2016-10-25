import React from 'react';

import totalsService from '../../services/totals-service'
import { formatPercentage, formatTime } from '../../utils'

import Friends from '../../widgets/friends'

export default class Totals extends React.Component {
  async componentDidMount() {
    const [topMpsAttendance, bottomMpsAttendance, topMpsStands, bottomMpsStands, topMpMinutesTalked, bottomMpMinutesTalked] =
        await Promise.all([
          totalsService.getTopMpsAttendance(),
          totalsService.getBottomMpsAttendance(),
          totalsService.getTopMpsStands(),
          totalsService.getBottomMpsStands(),
          totalsService.getTopMpsMinutes(),
          totalsService.getBottomMpsMinutes(),
        ])

    this.setState({
      topMpsAttendance,
      bottomMpsAttendance,
      topMpsStands,
      bottomMpsStands,
      topMpMinutesTalked,
      bottomMpMinutesTalked,
    })
  }

  render() {
    if (!this.state) {
      return null
    }

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
        <h1 className="title">Samantekt</h1>

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
