import { lthingToTerm } from '../../utility/lthing'
import { getMpToPartyLookup } from '../helpers'

export function getEmptySummary() {
  return {
    summary: {
      bills: {
        presenter: {
          count: 0,
        },
        coPresenter: {
          count: 0,
        },
        total: 0,
      },
      motions: {
        presenter: {
          count: 0,
        },
        coPresenter: {
          count: 0,
        },
        total: 0,
      },
      inquiries: {
        asked: 0,
        answered: 0,
        total: 0,
      },
    },
  }
}

const BILL = 'bill'
const MOTION = 'motion'
const INQUIRY = 'inquiry'
const INQUIRY_ANSWER = 'inquiryAnswer'

export const documentTypesOfInterest = {
  'frumvarp nefndar': BILL,
  'fsp. til munnl. svars': INQUIRY,
  'fsp. til skrifl. svars': INQUIRY,
  'þáltill. n.': MOTION,
  'þáltill.': MOTION,
  frumvarp: BILL,
  stjórnarfrumvarp: BILL,
  stjórnartillaga: MOTION,
  svar: INQUIRY_ANSWER,
}

export function documentIsOfInterest(doc, options = {}) {
  const documentHasPresenters = doc.presenters && doc.presenters.length

  if (!documentHasPresenters) {
    return false
  }

  const isBill = documentTypesOfInterest[doc.type] === BILL
  const isMotion = documentTypesOfInterest[doc.type] === MOTION

  if (options.ignoreInquiries) {
    return isBill || isMotion
  }

  return documentTypesOfInterest[doc.type]
}

export function generateMpDocumentSummaries(documents) {
  const mpDocumentsByLthing = {}
  const mpDocumentsTotal = {}

  const allTypes = {}

  Object.keys(documents).forEach((lthing) => {
    mpDocumentsByLthing[lthing] = {}

    const termForLthing = lthingToTerm(lthing)

    if (!mpDocumentsTotal[termForLthing.id]) {
      mpDocumentsTotal[termForLthing.id] = {}
    }

    const mpDocumentsTotalForTerm = mpDocumentsTotal[termForLthing.id]

    for (const doc of documents[lthing]) {
      allTypes[doc.type] = true

      if (!documentIsOfInterest(doc)) {
        continue
      }

      const isBill = documentTypesOfInterest[doc.type] === BILL
      const isMotion = documentTypesOfInterest[doc.type] === MOTION
      const isInquiry = documentTypesOfInterest[doc.type] === INQUIRY
      const isInquiryAnswer =
        documentTypesOfInterest[doc.type] === INQUIRY_ANSWER

      doc.presenters.forEach((presenter, index) => {
        if (mpDocumentsByLthing[lthing][presenter.id] === undefined) {
          mpDocumentsByLthing[lthing][presenter.id] = getEmptySummary()
        }

        if (mpDocumentsTotalForTerm[presenter.id] === undefined) {
          mpDocumentsTotalForTerm[presenter.id] = getEmptySummary()
        }

        const presenterType = index === 0 ? 'presenter' : 'coPresenter'

        if (isBill) {
          mpDocumentsByLthing[lthing][presenter.id].summary.bills[
            presenterType
          ].count += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.bills.total += 1
          mpDocumentsTotalForTerm[presenter.id].summary.bills[
            presenterType
          ].count += 1
          mpDocumentsTotalForTerm[presenter.id].summary.bills.total += 1
        } else if (isMotion) {
          mpDocumentsByLthing[lthing][presenter.id].summary.motions[
            presenterType
          ].count += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.motions.total += 1
          mpDocumentsTotalForTerm[presenter.id].summary.motions[
            presenterType
          ].count += 1
          mpDocumentsTotalForTerm[presenter.id].summary.motions.total += 1
        } else if (isInquiry) {
          mpDocumentsByLthing[lthing][presenter.id].summary.inquiries.asked += 1
          mpDocumentsTotalForTerm[presenter.id].summary.inquiries.asked += 1
        } else if (isInquiryAnswer) {
          mpDocumentsByLthing[lthing][
            presenter.id
          ].summary.inquiries.answered += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.inquiries.total += 1
          mpDocumentsTotalForTerm[presenter.id].summary.inquiries.answered += 1
          mpDocumentsTotalForTerm[presenter.id].summary.inquiries.total += 1
        }
      })
    }
  })

  console.log(Object.keys(allTypes).sort())

  return { mpDocumentsByLthing, mpDocumentsTotal }
}

function addToSummary(source, target) {
  source.summary.bills.presenter.count += target.summary.bills.presenter.count
  source.summary.bills.coPresenter.count +=
    target.summary.bills.coPresenter.count
  source.summary.bills.total += target.summary.bills.total

  source.summary.motions.presenter.count +=
    target.summary.motions.presenter.count
  source.summary.motions.coPresenter.count +=
    target.summary.motions.coPresenter.count
  source.summary.motions.total += target.summary.motions.total

  source.summary.inquiries.asked += target.summary.inquiries.asked
  source.summary.inquiries.answered += target.summary.inquiries.answered
  source.summary.inquiries.total += target.summary.inquiries.total
}

export function generatePartyDocumentSummaries(mpDocumentsByLthing) {
  const partyDocumentsByLthing = {}
  const partyDocumentsTotal = {}

  const mpToPartyLookup = getMpToPartyLookup()

  Object.keys(mpDocumentsByLthing).forEach((lthing) => {
    partyDocumentsByLthing[lthing] = {}

    const termForLthing = lthingToTerm(lthing)

    if (!partyDocumentsTotal[termForLthing.id]) {
      partyDocumentsTotal[termForLthing.id] = {}
    }

    const partyDocumentsTotalForTerm = partyDocumentsTotal[termForLthing.id]

    Object.keys(mpDocumentsByLthing[lthing]).forEach((mpId) => {
      const mpPartyId = mpToPartyLookup[lthing][mpId]
      const mpLthingSummary = mpDocumentsByLthing[lthing][mpId]

      if (partyDocumentsByLthing[lthing][mpPartyId] === undefined) {
        partyDocumentsByLthing[lthing][mpPartyId] = getEmptySummary()
      }

      addToSummary(partyDocumentsByLthing[lthing][mpPartyId], mpLthingSummary)

      if (partyDocumentsTotalForTerm[mpPartyId] === undefined) {
        partyDocumentsTotalForTerm[mpPartyId] = getEmptySummary()
      }

      addToSummary(partyDocumentsTotalForTerm[mpPartyId], mpLthingSummary)
    })
  })

  return { partyDocumentsByLthing, partyDocumentsTotal }
}
