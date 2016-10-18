import React from 'react';

import './styles.css';

export default class About extends React.Component {
  render() {
    return (
      <div>
        <h1 className="title">Þingmenn.is</h1>
        <div className="About">
          <p>Markmið þessa vefs er að koma betur fram upplýsingum sem leynast á <a href="http://althingi.is">alþingi.is</a>.</p>
        </div>
      </div>
    );
  }
}
