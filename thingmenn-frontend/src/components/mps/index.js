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
      searchInput: ''
    }
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(evt) {
    searchString = evt.target.value;
    this.setState({
      searchInput: searchString
    })
  }

  searchFilter(mp) {
    if (searchString.length) {
      return (mp.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
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
  }

  render() {
    const { mps, searchInput } = this.state
    return (
      <div className="fill">
        <h1 className="title">Allir þingmenn</h1>
        <SubNav handleSearchInput={this.handleSearchInput} searchInput={this.state.searchInput} />
        <List>
          {mps.filter(this.searchFilter).map(mp => (
            <Mp key={mp.id} {...mp} />
          ))}
        </List>
      </div>
    );
  }
}
