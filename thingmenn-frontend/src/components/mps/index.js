import React from 'react';
import sortInternational from 'sort-international'

import mpService from '../../services/mp-service'
import Mp from '../../widgets/mp'
import SubNav from '../../widgets/subnav'
import List from '../../widgets/list'

import './styles.css'

let searchInput = ''

/**
 * Partition MPs into lists, ordered by name or party AND name.
 * @param {Array} mps
 * @returns {{byName: Array.<T>, byParty: Array.<T>}}
 */
function createMpPartition(mps) {
  const compareFn = sortInternational('name')
  const partition = mps.reduce((parties, mp) => {
    parties[mp.party] = parties[mp.party] || []
    parties[mp.party].push(mp)
    return parties
  }, {})

  const sortParty = party => partition[party].sort(compareFn)
  const byParty = [].concat([], ...Object.keys(partition).sort(compareFn).map(sortParty))
  const byName = mps.sort(compareFn)

  return { byName, byParty }
}

export default class Mps extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mps: {
        byName: [],
        byParty: [],
      },
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

  searchFilter = (mp) => {
    const { searchInput } = this.state
    if (searchInput) {
      return (mp.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1)
    }
    return mp
  }


  componentWillMount() {
    mpService.getMps()
      .then(createMpPartition)
      .then(mps => this.setState({ mps }))
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

  render() {
    const { mps, sortByParty } = this.state
    const allMPs = mps[sortByParty ? 'byParty' : 'byName'].filter(this.searchFilter)

    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <SubNav handleSearchInput={this.handleSearchInput} searchInput={searchInput} sortByParty={sortByParty} />
        <List>
          {allMPs.map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
