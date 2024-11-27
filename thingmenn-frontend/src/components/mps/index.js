import React from 'react'

import mpService from '../../services/mp-service'
import totalService from '../../services/totals-service'
import Mp from '../../widgets/mp'
import List from '../../widgets/list'
import DetailsMenu from '../../widgets/details-menu'

import './styles.css'
import { generateLthingList } from '../../utility/periods'

let searchInput = ''

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lthing: null,
      lthingLookup: {},
      mps: [],
      lthings: [],
      searchInput: '',
      sortByParty: false,
    }
  }

  componentWillMount() {
    const lthing = this.props.params.lthing
    this.getData(lthing)
    this.setSorting(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const lthing = nextProps.params.lthing

    this.getData(lthing)
    this.setSorting(this.props)
  }

  getData(lthing) {
    mpService.getMpsByLthing(lthing).then((mps) => {
      this.setState(() => ({ mps, lthing }))
    })

    totalService.getLthings().then((lthings) => {
      const lthingLookup = {}
      lthings.forEach((lthing) => (lthingLookup[lthing.id] = lthing))
      this.setState(() => ({ lthings, lthingLookup }))
    })
  }

  handleSearchInput = (evt) => {
    searchInput = evt.target.value
    this.setState({
      searchInput,
    })
  }

  searchFilter(mp) {
    const { searchInput } = this.state
    if (searchInput) {
      return mp.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1
    }
    return mp
  }

  setSorting(props) {
    const { query } = props.location
    const sortByParty = query.rada === 'flokkar'
    this.setState(() => ({ sortByParty, searchInput }))
  }

  sortItem(mp1, mp2) {
    if (this.state.sortByParty) {
      return mp1.party.localeCompare(mp2.partyId)
    }
    return mp1.mpName.localeCompare(mp2.mpName)
  }

  generateLthingList(lthings, lthingLookup) {
    if (!lthings.length) {
      return []
    }

    const lthingsForMpList = lthings.map((period) => Number(period.id))

    return generateLthingList(lthingsForMpList, lthings, lthingLookup, ``)
  }

  render() {
    const { mps, sortByParty, lthing, lthings, lthingLookup } = this.state

    const items = mps
      .filter(this.searchFilter.bind(this))
      .sort(this.sortItem.bind(this))

    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <DetailsMenu
          menuItems={this.generateLthingList(lthings, lthingLookup)}
        />
        <List>
          {items.map((mp) => (
            <Mp key={mp.id} lthing={lthing} {...mp} />
          ))}
        </List>
      </div>
    )
  }
}
