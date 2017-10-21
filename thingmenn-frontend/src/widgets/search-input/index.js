import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

export default class SearchInput extends React.Component {
  render() {
    return (
      <input placeholder="Sía" value={this.props.value} className="Search-input" onChange={this.props.handleSearchInput} />
    )
  }
}

SearchInput.PropTypes = {
  handleSearchInput: PropTypes.function,
}
