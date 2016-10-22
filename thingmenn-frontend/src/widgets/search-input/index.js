import React from 'react'
import './styles.css'

export default class SearchInput extends React.Component {
  render() {
    return (
      <input placeholder="Sía" className="Search-input" onChange={this.props.handleSearchInput} />
    )
  }
}

SearchInput.PropTypes = {
  handleSearchInput: React.PropTypes.function,
}
