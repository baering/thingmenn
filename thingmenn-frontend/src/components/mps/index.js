import React from 'react';

import mpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'
import DetailsMenu from '../../widgets/details-menu'

import './styles.css'

let searchInput = ''

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lthing: null,
      mps: [],
      searchInput: '',
      sortByParty: false,
    }
  }

  handleSearchInput = (evt) => {
    searchInput = evt.target.value
    this.setState({
      searchInput
    })
  }

  searchFilter(mp) {
    const { searchInput } = this.state
    if (searchInput) {
      return (mp.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1)
    }
    return mp
  }

  componentWillMount() {
    const lthing = this.props.params.lthing
    mpService.getMpsByLthing(lthing)
      .then(mps => {
        this.setState(() => ({ mps, lthing }))
      })
    this.setSorting(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setSorting(nextProps)
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
    const { mps, sortByParty, lthing } = this.state

    const items = mps.filter(this.searchFilter.bind(this))
        .sort(this.sortItem.bind(this))

    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <DetailsMenu />
        <SubNav handleSearchInput={this.handleSearchInput} searchInput={searchInput} sortByParty={sortByParty} />
        <List>
          {items.map(mp => (
            <Mp key={mp.id} lthing={lthing} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
