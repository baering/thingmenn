import React from 'react'
import classNames from 'classnames'
import { IndexLink, Link } from 'react-router'

import SearchInput from '../search-input'
import './styles.css'

const SubNav = ({
  handleSearchInput,
  sortByParty,
  searchInput,
}) => {
  return (
    <nav className="SubNav">
      <IndexLink to="/" className={classNames('SubNav-item', { 'is-active': !sortByParty })}><span className="typcn typcn-sort-alphabetically"></span>Stafrófsröð</IndexLink>
      <Link to="/" query={{ rada: 'flokkar' }} className="SubNav-item" activeClassName="is-active"><span className="typcn typcn-th-small"></span>Raða eftir flokki</Link>
      <SearchInput value={searchInput} handleSearchInput={handleSearchInput}/>
    </nav>
  )
}

export default SubNav;
