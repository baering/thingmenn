import React from 'react'

import partyService from '../../services/party-service'
import totalService from '../../services/totals-service'

import Party from '../../widgets/party'
import List from '../../widgets/list'

import './styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parties: [],
      lthings: [],
    }
  }

  componentWillMount() {
    const lthing = this.props.params.lthing
    this.getData(lthing)
  }

  componentWillReceiveProps(nextProps) {
    const lthing = nextProps.params.lthing

    this.getData(lthing)
  }

  getData(lthing) {
    partyService.getPartiesByLthing(lthing).then((parties) => {
      this.setState(() => ({ parties }))
    })

    totalService.getLthings().then((lthings) => {
      this.setState(() => ({ lthings }))
    })
  }

  render() {
    const { parties, lthings } = this.state

    return (
      <div className="fill">
        <h1 className="title">Allir þingflokkar</h1>
        <List>
          {parties.map((party) => (
            <Party
              key={party.id}
              lthing={lthings || this.props.params.lthing}
              {...party}
            />
          ))}
        </List>
      </div>
    )
  }
}
