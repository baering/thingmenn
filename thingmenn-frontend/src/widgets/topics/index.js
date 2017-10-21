import React, { Component } from 'react'
import classNames from 'classnames'
import './styles.css'

class Topics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
    }
  }

  render() {
    const { children, onChange } = this.props

    return (
      <div className="Topics">
        <div className="Topics-tabs">
          <a href="#" className="Topics-tab">
            Ræður
          </a>
          <a href="#" className="Topics-tab">
            Atkvæði
          </a>
          <a href="#" className="Topics-tab">
            Þingskjöl
          </a>
        </div>
        {children}
      </div>
    )
  }
}

export default Topics
