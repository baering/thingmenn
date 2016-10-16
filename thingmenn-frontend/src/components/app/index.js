import React from 'react'
import './styles.css'

class App extends React.Component {
  render() {
    return (
      <div className='index'>
        <div className='index__header'>
          <ul>
            <li><a href='/thingmenn'>Skoða þingmenn</a></li>
            <li><a href='/thingflokkar'>Skoða þingflokka</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App
