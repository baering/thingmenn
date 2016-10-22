import React from 'react';

import MpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css';

let searchString = ''

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.mpService = new MpService()
    this.state = {
      mps: this.mpService.getMpsIfCached(),
      searchInput: '',
      sortByParty: false,
    }
  }

  handleSearchInput = (evt) => {
    searchString = evt.target.value
    this.setState({
      searchInput: searchString
    })
  }

  searchFilter(mp) {
    if (searchString.length) {
      return (mp.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    }
    return mp
  }

  componentDidMount() {
    if (!this.state.mps.length) {
      this.mpService.getMps()
        .then(mps => {
          this.setState({ mps })
        })
    }
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

  sortItem(mp1, mp2) {
    if (this.state.sortByParty) {
      return mp1.party.localeCompare(mp2.party)
    }
    return mp1.name.localeCompare(mp2.name)
  }

  render() {
    const { mps, searchInput, sortByParty } = this.state

    const items = mps.filter(this.searchFilter)
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
