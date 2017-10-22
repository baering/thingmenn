import React from 'react'
import PropTypes from 'prop-types'

import { formatTime } from '../../utils'

import './styles.css'

const Documents = ({ documentSummary }) => {
  if (!(documentSummary && documentSummary.summary)) {
    return null
  }
  return (
    <div className="Documents">
      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.bills.presenter.count}</p>
          <h1 className="Documents-statsHeading">
            Frumvörp sem 1. flutningsmaður
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.bills.coPresenter.count}</p>
          <h1 className="Documents-statsHeading">
            Frumvörp sem meðflutningsmaður
          </h1>
        </div>
      </div>

      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.motions.presenter.count}</p>
          <h1 className="Documents-statsHeading">
            Þingsályktunartillögur sem 1. flutningsmaður
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.motions.coPresenter.count}</p>
          <h1 className="Documents-statsHeading">
            Þingsályktunartillögur sem meðflutningsmaður
          </h1>
        </div>
      </div>

      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.inquiries.asked}</p>
          <h1 className="Documents-statsHeading">
            Fyrirspurnir
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.inquiries.answered}</p>
          <h1 className="Documents-statsHeading">
            Fyrirspurnum svarað
          </h1>
        </div>
      </div>
    </div>
  )
}

Documents.propTypes = {

}

export default Documents
