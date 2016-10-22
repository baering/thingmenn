import React from 'react';

import './styles.css';

export default class About extends React.Component {
  render() {
    return (
      <div className="fill">
        <h1 className="title">Um verkefnið</h1>
        <div className="About">
          <p>Á þessum vef finnur þú upplýsingar og tölfræði um þingmenn og þingflokka fyrir kjörtímabilið 2013-2016.</p>
          <p>Markmið þessa verkefnis er að sækja hluta af því mikla magni gagna sem finna má á vef <a className='u-link' href="http://althingi.is">Alþingis</a>, vinna úr þeim gögnum og setja fram á skemmtilegan, fræðandi og helst af öllu hlutlausan máta.</p>
          <p>Þetta verkefni er eftir <a className='u-link' href="http://twitter.com/baerinq" target="_blank">Bæring Gunnar Steinþórsson</a>, sérstakar þakkir fá samstarfsfélagar mínir hjá <a className='u-link' href="http://aranja.com" target="_blank">Aranja</a>; <br/> <a className='u-link' href="http://twitter.com/justifycontent" target="_blank">Davíð Bachmann Jóhannesson</a>, <a className='u-link' href="http://twitter.com/herrhelms" target="_blank">Sebastian Helms</a> og <a className='u-link' href="http://twitter.com/thorsteinsson" target="_blank">Ægir Giraldo Þorsteinsson</a> fyrir hjálp við útfærslu og hönnun á vefnum.</p>
          <p>Ábendingar og hugmyndir eru vel þegnar á <a className='u-link' href='mailto:thingmenn@aranja.com'>thingmenn@aranja.com</a>.</p>
        </div>
      </div>
    );
  }
}
