import React from 'react'

import partyService from '../../services/party-service'

import Party from '../../widgets/party'
import List from '../../widgets/list'

import './styles.css'

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      parties: [],
    }
  }

  componentWillMount() {
    this.getData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.params)
  }

  getData(params) {
    partyService.getParties(params).then((parties) => {
      this.setState(() => ({ parties }))
    })
  }

  render() {
    const { parties } = this.state

    return (
      <div className="fill">
        <h1 className="title">Allir þingflokkar</h1>
        <List>
          {parties.map((party) => (
            <Party
              key={party.id}
              {...party}
            />
          ))}
        </List>
      </div>
    )
  }
}
