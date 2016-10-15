import React from 'react'
import './styles.css'

class App extends React.Component {
  render() {
    const { className } = this.props;

    return (
      <div className='index'>
        <div className='index__header'>
          <a href='/thingmenn'>Skoða þingmenn</a>
        </div>
      </div>
    );
  }
}

export default App
