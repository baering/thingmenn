import React from 'react';

import mpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css'

let searchInput = ''

export default class Mps extends React.Component {
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

  async componentWillMount() {
    const mps = await mpService.getMps()
    this.setState({ mps })
    this.setSorting(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setSorting(nextProps)
  }

  setSorting(props) {
    const { query } = props.location
    const sortByParty = query.rada === 'flokkar'
    this.setState({ sortByParty, searchInput })
  }

  sortItem(mp1, mp2) {
    if (this.state.sortByParty) {
      return mp1.party.localeCompare(mp2.party)
    }
    return mp1.name.localeCompare(mp2.name)
  }

  render() {
    if (!this.state) {
      return null
    }

    const { mps, sortByParty } = this.state

    const items = mps.filter(this.searchFilter.bind(this))
        .sort(this.sortItem.bind(this))

    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <SubNav handleSearchInput={this.handleSearchInput} searchInput={searchInput} sortByParty={sortByParty} />
        <List>
          {items.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
