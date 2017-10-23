import React from 'react'
import { Link, IndexLink } from 'react-router';
import './styles.css'

class Nav extends React.Component {
  render() {
    return (
      <nav className="Nav">
        <div className="Nav-top">
          <IndexLink to="/" className="Nav-title" activeClassName="is-active">Þingmenn<span className='Nav-titleDot'>.</span>is</IndexLink>
        </div>
        <IndexLink to="/thing/allt" className="Nav-item" activeClassName="is-active"><span className="typcn typcn-user-outline"></span> Þingmenn</IndexLink>
        <Link to="/thingflokkar" className="Nav-item" activeClassName="is-active"><span className="typcn typcn-group-outline"></span> Þingflokkar</Link>
        <Link to="/samantekt/thing/146" className="Nav-item" activeClassName="is-active"><span className="typcn typcn-equals-outline"></span> Samantekt</Link>
        <Link to="/um" className="Nav-item" activeClassName="is-active"><span className="typcn typcn-info-large-outline"></span> Um verkefnið</Link>
        <footer className="Nav-footnote">Útgáfa 2.0beta</footer>
      </nav>
    );
  }
}

export default Nav
