import React from 'react';

import MpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css';

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.mpService = new MpService()
    this.state = {
      mps: this.mpService.getMpsIfCached(),
    }
  }

  componentDidMount() {
    if (!this.state.mps.length) {
      this.mpService.getMps()
        .then(mps => {
          this.setState({ mps })
        })
    }
  }

  render() {
    const { mps } = this.state

    return (
      <div>
        <h1 className="title">Allir þingmenn</h1>
        <SubNav />
        <List>
          {mps.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
