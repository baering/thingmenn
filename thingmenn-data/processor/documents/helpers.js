import {
  getMpToPartyLookup,
} from '../helpers'

export function isOfCaseType(documentType) {
  if (documentType.indexOf('frumvarp') !== -1) {
    return true
  } else if (documentType.indexOf('þáltill') !== -1) {
    return true
  }
  return false
}

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

const documentTypes = {
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

export function generateMpDocumentSummaries(documents) {
  const mpDocumentsByLthing = {}
  const mpDocumentsTotal = {}

  const allTypes = {}

  Object.keys(documents).forEach(lthing => {
    mpDocumentsByLthing[lthing] = {}

    for (const doc of documents[lthing]) {
      const isBill = documentTypes[doc.type] === BILL
      const isMotion = documentTypes[doc.type] === MOTION
      const isInquiry = documentTypes[doc.type] === INQUIRY
      const isInquiryAnswer = documentTypes[doc.type] === INQUIRY_ANSWER

      allTypes[doc.type] = true

      if (!(isBill || isMotion || isInquiry || isInquiryAnswer)) {
        continue
      }

      if (!doc.presenters) {
        continue
      }

      doc.presenters.forEach((presenter, index) => {
        if (mpDocumentsByLthing[lthing][presenter.id] === undefined) {
          mpDocumentsByLthing[lthing][presenter.id] = getEmptySummary()
        }

        if (mpDocumentsTotal[presenter.id] === undefined) {
          mpDocumentsTotal[presenter.id] = getEmptySummary()
        }

        const presenterType = index === 0 ? 'presenter' : 'coPresenter'

        if (isBill) {
          mpDocumentsByLthing[lthing][presenter.id].summary.bills[presenterType].count += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.bills.total += 1
          mpDocumentsTotal[presenter.id].summary.bills[presenterType].count += 1
          mpDocumentsTotal[presenter.id].summary.bills.total += 1
        } else if (isMotion) {
          mpDocumentsByLthing[lthing][presenter.id].summary.motions[presenterType].count += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.motions.total += 1
          mpDocumentsTotal[presenter.id].summary.motions[presenterType].count += 1
          mpDocumentsTotal[presenter.id].summary.motions.total += 1
        } else if (isInquiry) {
          mpDocumentsByLthing[lthing][presenter.id].summary.inquiries.asked += 1
          mpDocumentsTotal[presenter.id].summary.inquiries.asked += 1
        } else if (isInquiryAnswer) {
          mpDocumentsByLthing[lthing][presenter.id].summary.inquiries.answered += 1
          mpDocumentsByLthing[lthing][presenter.id].summary.inquiries.total += 1
          mpDocumentsTotal[presenter.id].summary.inquiries.answered += 1
          mpDocumentsTotal[presenter.id].summary.inquiries.total += 1
        }
      })
    }
  })

  console.log(Object.keys(allTypes).sort())

  return { mpDocumentsByLthing, mpDocumentsTotal }
}

function addToSummary(source, target) {
  source.summary.bills.presenter.count += target.summary.bills.presenter.count
  source.summary.bills.coPresenter.count += target.summary.bills.coPresenter.count
  source.summary.bills.total += target.summary.bills.total

  source.summary.motions.presenter.count += target.summary.motions.presenter.count
  source.summary.motions.coPresenter.count += target.summary.motions.coPresenter.count
  source.summary.motions.total += target.summary.motions.total

  source.summary.inquiries.asked += target.summary.inquiries.asked
  source.summary.inquiries.answered += target.summary.inquiries.answered
  source.summary.inquiries.total += target.summary.inquiries.total
}

export function generatePartyDocumentSummaries(mpDocumentsByLthing) {
  const partyDocumentsByLthing = {}
  const partyDocumentsTotal = {}

  const mpToPartyLookup = getMpToPartyLookup()

  Object.keys(mpDocumentsByLthing).forEach(lthing => {
    partyDocumentsByLthing[lthing] = {}

    Object.keys(mpDocumentsByLthing[lthing]).forEach(mpId => {
      const mpPartyId = mpToPartyLookup[lthing][mpId]
      const mpLthingSummary = mpDocumentsByLthing[lthing][mpId]

      if (partyDocumentsByLthing[lthing][mpPartyId] === undefined) {
        partyDocumentsByLthing[lthing][mpPartyId] = getEmptySummary()
      }

      addToSummary(partyDocumentsByLthing[lthing][mpPartyId], mpLthingSummary)

      if (partyDocumentsTotal[mpPartyId] === undefined) {
        partyDocumentsTotal[mpPartyId] = getEmptySummary()
      }

      addToSummary(partyDocumentsTotal[mpPartyId], mpLthingSummary)
    })
  })

  return { partyDocumentsByLthing, partyDocumentsTotal }
}
