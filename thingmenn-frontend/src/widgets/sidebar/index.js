import React from 'react'
import './styles.css'

class Sidebar extends React.Component {
  render() {
    return (
      <nav className="Sidebar">
        <div className="Sidebar-top">
          <h1>Þingmenn.is</h1>
        </div>
        <a href="/" className="Sidebar-item is-active"><span className="typcn typcn-user-outline"></span> Þingmenn</a>
        <a href="#" className="Sidebar-item"><span className="typcn typcn-group-outline"></span> Flokkar</a>
        <a href="#" className="Sidebar-item"><span className="typcn typcn-zoom-outline"></span> Leita á síðu</a>
        <a href="#" className="Sidebar-item"><span className="typcn typcn-info-large-outline"></span> Um verkefnið</a>
      </nav>
    );
  }
}

export default Sidebar
