import React from 'react'
import classnames from 'classnames'
import './styles.css'

class App extends React.Component {
  render() {
    const { className } = this.props;

    return (
      <div className={classnames('App', className)}>
        <div className="App-header">
          <h2>Thingmenn</h2>
        </div>
      </div>
    );
  }
}

export default App
