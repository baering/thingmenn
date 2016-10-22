import React from 'react';

import totalsService from '../../services/totals-service'
import { formatPercentage } from '../../utils'

import Friends from '../../widgets/friends'

export default class Totals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      topMpsAttendance: [],
      bottomMpsAttendance: [],
      topMpsStands: [],
      bottomMpsStands: [],
    }
  }

  componentDidMount() {
    totalsService.getTopMpsAttendance()
      .then(topMpsAttendance => {
        this.setState({ topMpsAttendance })
      })

    totalsService.getBottomMpsAttendance()
      .then(bottomMpsAttendance => {
        this.setState({ bottomMpsAttendance })
      })

    totalsService.getTopMpsStands()
      .then(topMpsStands => {
        this.setState({ topMpsStands })
      })

    totalsService.getBottomMpsStands()
      .then(bottomMpsStands => {
        this.setState({ bottomMpsStands })
      })
  }

  render() {
    const { topMpsAttendance, bottomMpsAttendance, topMpsStands, bottomMpsStands } = this.state

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
        </div>
      </div>
    );
  }
}
