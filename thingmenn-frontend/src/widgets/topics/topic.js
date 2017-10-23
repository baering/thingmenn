import React from 'react'
import classNames from 'classnames'

const Topic = ({
  title,
  active,
  children
}) => (
  <div className={classNames("Topic", active && 'is-active')}>
    {title}
    {children}
  </div>
)

export default Topic