import React from 'react';

import totalsService from '../../services/totals-service'
import { formatPercentage, formatTime } from '../../utils'

import Friends from '../../widgets/friends'

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

  async componentDidMount() {
    const topMpsAttendance = await totalsService.getTopMpsAttendance()
    this.setState({ topMpsAttendance })

    const bottomMpsAttendance = await totalsService.getBottomMpsAttendance()
    this.setState({ bottomMpsAttendance })

    const topMpsStands = await totalsService.getTopMpsStands()
    this.setState({ topMpsStands })

    const bottomMpsStands = await totalsService.getBottomMpsStands()
    this.setState({ bottomMpsStands })

    const topMpMinutesTalked = await totalsService.getTopMpsMinutes()
    this.setState({ topMpMinutesTalked })

    const bottomMpMinutesTalked = await totalsService.getBottomMpsMinutes()
    this.setState({ bottomMpMinutesTalked })
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
