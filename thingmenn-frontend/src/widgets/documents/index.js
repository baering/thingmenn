import React from 'react'

import './styles.css'

const Documents = ({ documentSummary }) => {
  if (!(documentSummary && documentSummary.summary)) {
    return null
  }
  return <div className="Documents">
      <div className="Documents-items">
        <h2 className="Documents-subheader">1. flutningsmaður</h2>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.bills.presenter.count}
          </p>
          <h1 className="Documents-statsHeading">Frumvörp</h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.motions.presenter.count}
          </p>
          <h1 className="Documents-statsHeading">Þingsályktunartillögur</h1>
        </div>
      </div>

      <div className="Documents-items">
      <h2 className="Documents-subheader">Meðflutningsmaður</h2>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.motions.coPresenter.count}
          </p>
          <h1 className="Documents-statsHeading">Frumvörp</h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.motions.coPresenter.count}
          </p>
          <h1 className="Documents-statsHeading">Þingsályktunartillögur</h1>
        </div>
      </div>

      <div className="Documents-items">
      <h2 className="Documents-subheader">Fyrirspurnir</h2>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.inquiries.asked}
          </p>
          <h1 className="Documents-statsHeading">Spurningar</h1>
        </div>
        <div className="Documents-item" key={document.id}>
          <p className="Documents-statsText">
            {documentSummary.summary.inquiries.answered}
          </p>
          <h1 className="Documents-statsHeading">Svör</h1>
        </div>
      </div>
    </div>
}

Documents.propTypes = {

}

export default Documents
