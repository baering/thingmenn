import React from 'react'
import './styles.css'

class Nav extends React.Component {
  render() {
    return (
      <nav className="Nav">
        <div className="Nav-top">
          <h1 className="Nav-title">Þingmenn.is</h1>
          <h1 className="Nav-title--shorter">Þingmenn</h1>
          <h1 className="Nav-title--shortest">ÞM</h1>
        </div>
        <a href="/" className="Nav-item is-active"><span className="typcn typcn-user-outline"></span> Þingmenn</a>
        <a href="#" className="Nav-item"><span className="typcn typcn-group-outline"></span> Flokkar</a>
        <a href="/um" className="Nav-item"><span className="typcn typcn-info-large-outline"></span> Um verkefnið</a>
      </nav>
    );
  }
}

export default Nav
