import React from 'react';

import './styles.css';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className='not-found'>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}
