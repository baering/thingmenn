import React from 'react';

import './styles.css';

export default class About extends React.Component {
  render() {
    return (
      <div>
        <h1 className="title">Um verkefnið</h1>
        <div className="About">
          <p>Markmið þessa verkefnis er að sækja hluta af því mikla magni gagna sem finna má á vef <a href="http://althingi.is">Alþingis</a>, vinna úr þeim gögnum og setja fram á skemmtilegan og fræðandi máta.</p>
          <p>Þetta verkefni er eftir <a href="http://twitter.com/baerinq" target="_blank">Bæring Gunnar Steinþórsson</a>, sérstakar þakkir fá <a href="http://twitter.com/justifycontent" target="_blank">Davíð Bachmann Jóhannesson</a>, <a href="http://twitter.com/herrhelms" target="_blank">Sebastian Helms</a> og <a href="http://twitter.com/thorsteinsson" target="_blank">Ægir Giraldo Þorsteinsson</a> fyrir hjálp við útfærslu og hönnun á vefnum.</p>
        </div>
      </div>
    );
  }
}
