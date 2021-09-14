import React from 'react'

import mpService from '../../services/mp-service'
import totalService from '../../services/totals-service'
import Mp from '../../widgets/mp'
import List from '../../widgets/list'
import DetailsMenu from '../../widgets/details-menu'

import './styles.css'

let searchInput = ''

const initialLthingsMenuList = [
  {
    name: 'Öll kjörtímabil',
    url: '/kjortimabil/allt',
  },
]

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      params: null,
      mps: [],
      terms: [],
      searchInput: '',
      sortByParty: false,
    }
  }

  componentWillMount() {
    const { lthing, term } = this.props.params
    this.getData({ lthing, term })
    this.setSorting(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { lthing, term } = nextProps.params
    this.getData({ lthing, term })
    this.setSorting(this.props)
  }

  getData(params) {
    mpService.getMps(params).then((mps) => {
      this.setState(() => ({ mps, params }))
    })

    totalService.getTerms().then((terms) => {
      this.setState(() => ({ terms }))
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

  render() {
    const { mps, params, terms } = this.state

    const items = mps
      .filter(this.searchFilter.bind(this))
      .sort(this.sortItem.bind(this))

    const termsToRender = initialLthingsMenuList.concat(terms.map((term) => ({
      name: term.id,
      url: `/kjortimabil/${term.id}`,
    })))

    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <DetailsMenu menuItems={termsToRender} />
        <List>
          {items.map((mp) => (
            <Mp key={mp.id} params={params} {...mp} />
          ))}
        </List>
      </div>
    )
  }
}
