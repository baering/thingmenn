import React from 'react'
import './styles.css'

class Nav extends React.Component {
  render() {
    return (
      <nav className="Nav">
        <div className="Nav-top">
          <a href='/' className="Nav-title">Þingmenn<span className='u-hiddenSmall'><span className='Nav-titleDot'>.</span>is</span></a>
        </div>
        <a href="/" className="Nav-item is-active"><span className="typcn typcn-user-outline"></span> Þingmenn</a>
        <a href="#" className="Nav-item"><span className="typcn typcn-group-outline"></span> Flokkar</a>
        <a href="/um" className="Nav-item"><span className="typcn typcn-info-large-outline"></span> Um verkefnið</a>
      </nav>
    );
  }
}

export default Nav
