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
      <h2>1. flutningsmaður</h2>
      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.bills.presenter.count}</p>
          <h1 className="Documents-statsHeading">
            Frumvörp
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.motions.presenter.count}</p>
          <h1 className="Documents-statsHeading">
            Þingsályktunartillögur
          </h1>
        </div>
      </div>

      <h2>Meðflutningsmaður</h2>
      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.motions.coPresenter.count}</p>
          <h1 className="Documents-statsHeading">
            Frumvörp
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.motions.coPresenter.count}</p>
          <h1 className="Documents-statsHeading">
            Þingsályktunartillögur
          </h1>
        </div>
      </div>

      <h2>Fyrirspurnir</h2>
      <div className="Documents-items">
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.inquiries.asked}</p>
          <h1 className="Documents-statsHeading">
            Spurningar
          </h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">{documentSummary.summary.inquiries.answered}</p>
          <h1 className="Documents-statsHeading">
            Svör
          </h1>
        </div>
      </div>
    </div>
  )
}

Documents.propTypes = {

}

export default Documents
