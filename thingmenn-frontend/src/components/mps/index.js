import React from 'react';
import icelandic from 'sort-international'

import mpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css'

export default class Mps extends React.Component {
  state = {
    mps: [],
    searchInput: '',
    sortByParty: false,
  }

  handleSearchInput = (evt) => {
    const searchInput = evt.target.value
    this.setState({ searchInput })
  }

  searchFilter = (mp) => {
    const { searchInput } = this.state
    return mp.name.toLowerCase().includes(searchInput.toLowerCase())
  }

  componentDidMount() {
    this.getMps()
    this.setSorting(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setSorting(nextProps)
  }

  setSorting(props) {
    const { query } = props.location
    const sortByParty = query.rada === 'flokkar'
    this.setState({ sortByParty })
  }

  async getMps() {
    const data = await mpService.getMps()
    const mps = data.map(mp => ({ ...mp, partyKey: `${mp.party}${mp.name}` }))
    this.setState({ mps })
  }

  get mpList() {
    const { mps, sortByParty } = this.state
    const list = mps
      .filter(this.searchFilter)
      .sort(icelandic(sortByParty ? 'partyKey' : 'name'))
    return list
  }

  render() {
    const { sortByParty, searchInput } = this.state
    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <SubNav
          handleSearchInput={this.handleSearchInput}
          searchInput={searchInput}
          sortByParty={sortByParty}
        />
        <List>
          {this.mpList.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
