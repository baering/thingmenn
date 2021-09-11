import React, { Component } from 'react'
import classNames from 'classnames'
import './styles.css'

const topics = [
  {
    title: 'Atkvæði',
  },
  {
    title: 'Ræður',
  },
  {
    title: 'Þingskjöl',
  },
]

class Topics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
    }
  }

  handleChangingTabs(evt, id) {
    evt.preventDefault()

    this.setState(() => ({
      activeTab: id,
    }))
  }

  render() {
    const { children } = this.props
    const { activeTab } = this.state

    return (
      <div className="Topics">
        <div className="Topics-tabs">
          {topics.map((topic, index) => (
            <a
              key={topic.title}
              href="#"
              className={classNames(
                'Topics-tab',
                activeTab === index && 'is-active',
              )}
              onClick={(evt) => this.handleChangingTabs(evt, index)}
            >
              {topic.title}
            </a>
          ))}
        </div>
        {children(activeTab)}
      </div>
    )
  }
}

export default Topics
