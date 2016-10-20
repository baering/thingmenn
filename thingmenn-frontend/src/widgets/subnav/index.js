import React from 'react'
import './styles.css'

const SubNav = () => {
  return (
    <nav className="SubNav">
      <a href="#" className="SubNav-item is-active"><span className="typcn typcn-sort-alphabetically"></span>Stafrófsröð</a>
      <a href="#" className="SubNav-item"><span className="typcn typcn-th-small"></span>Raða eftir flokki</a>
      <input placeholder="Sía" className="SubNav-search"/>
    </nav>
  )
}

export default SubNav;
