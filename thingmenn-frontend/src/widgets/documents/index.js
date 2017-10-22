import React from 'react'
import PropTypes from 'prop-types'

import { formatTime } from '../../utils'

import './styles.css'

const Documents = ({ documentSummary }) => {
  const documents = Object.keys(documentSummary)
    .map(key => ({
      id: key,
      time: formatTime(documentSummary[key].minutes),
      count: documentSummary[key].count,
    }))
  return (
    <div className="Documents">
      <div className="Documents-items">
        {documents.map((document, index) => (
          <div className="Documents-item" key={document.id}>
            <p className="Documents-statsText">123</p>
            <h1 className="Documents-statsHeading">
              {document.id} ({document.count})
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

Documents.propTypes = {

}

export default Documents
