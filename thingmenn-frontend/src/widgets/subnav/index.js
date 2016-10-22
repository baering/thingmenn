import React from 'react'
import SearchInput from '../search-input'
import './styles.css'

const SubNav = ({
  handleSearchInput
}) => {
  return (
    <nav className="SubNav">
      <a href="#" className="SubNav-item is-active"><span className="typcn typcn-sort-alphabetically"></span>Stafrófsröð</a>
      <a href="#" className="SubNav-item"><span className="typcn typcn-th-small"></span>Raða eftir flokki</a>
      <SearchInput handleSearchInput={handleSearchInput}/>
    </nav>
  )
}

export default SubNav;
