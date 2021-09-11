import React from "react";

import "./styles.css";

export default class About extends React.Component {
  render() {
    return (
      <div className="fill">
        <h1 className="title">Um verkefnið</h1>
        <div className="About">
          <h2>Um vefinn</h2>
          <p>
            Á þessum vef finnur þú upplýsingar og tölfræði um þingmenn og
            þingflokka fyrir árin 2007 til 2021.
          </p>
          <p>
            Markmið vefsins er að sækja gögn sem finna má á vef{" "}
            <a className="u-link" href="http://www.althingi.is/altext/xml/">
              Alþingis
            </a>
            , vinna úr þeim og setja fram á skemmtilegan, fræðandi og helst af
            öllu hlutlausan máta.
          </p>

          <h2>Hvaðan koma gögnin?</h2>
          <p>
            Öll gögn eru sótt af vef Alþingis og skiptast þau niður í þrjá
            meginflokka: atkvæðaskrár, ræðuskrár og þingskjalalista.
          </p>
          <p>
            Gögnin eru sótt sjálfkrafa, hver einasta undirsíða fyrir alla
            þingmenn er skoðuð, þau flokkuð og skoðuð fyrir hvern þingmann.
          </p>
          <p>
            Eftir að hafa unnið úr þeim fyrir hvern þingmann eru upplýsingum
            safnað saman til þess að fá gögn fyrir þingflokkana.
          </p>

          <h2>Verkefnið</h2>
          <p>
            Þetta er verkefni eftir{" "}
            <a
              className="u-link"
              href="http://twitter.com/baerinq"
              target="_blank"
            >
              Bæring Gunnar Steinþórsson
            </a>
            .
          </p>
          <p>
            Sérstakar þakkir fá samstarfsfélagar mínir hjá{" "}
            <a className="u-link" href="http://aranja.com" target="_blank">
              Aranja
            </a>
            ;<br />{" "}
            <a
              className="u-link"
              href="http://twitter.com/dbjcodes"
              target="_blank"
            >
              Davíð Bachmann Jóhannesson
            </a>
            ,{" "}
            <a
              className="u-link"
              href="http://twitter.com/herrhelms"
              target="_blank"
            >
              Sebastian Helms
            </a>{" "}
            og{" "}
            <a
              className="u-link"
              href="http://twitter.com/thorsteinsson"
              target="_blank"
            >
              Ægir Giraldo Þorsteinsson
            </a>{" "}
            fyrir hjálp við útfærslu og hönnun á vefnum.
          </p>
          <p>
            Ábendingar og hugmyndir eru vel þegnar á{" "}
            <a className="u-link" href="mailto:thingmenn@aranja.com">
              thingmenn@aranja.com
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}
