import React from 'react';
import classnames from 'classnames';

import './styles.css';

export default class NotFound extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}
