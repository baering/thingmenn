import { loadFile, writeToFile } from '../../utility/file'

import {
  getEmptySummary,
} from './helpers'

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

const allTypes = {}

export default function process() {
  const documents = loadFile('data/v2/documents.json')

  const mpCasesByLthing = {}
  const mpCasesTotal = {}

  Object.keys(documents).forEach(lthing => {
    mpCasesByLthing[lthing] = {}

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
        if (mpCasesByLthing[lthing][presenter.id] === undefined) {
          mpCasesByLthing[lthing][presenter.id] = getEmptySummary()
        }

        if (mpCasesTotal[presenter.id] === undefined) {
          mpCasesTotal[presenter.id] = getEmptySummary()
        }

        const presenterType = index === 0 ? 'presenter' : 'coPresenter'

        if (isBill) {
          mpCasesByLthing[lthing][presenter.id].summary[presenterType].numberOfBills += 1
          mpCasesTotal[presenter.id].summary[presenterType].numberOfBills += 1
        } else if (isMotion) {
          mpCasesByLthing[lthing][presenter.id].summary[presenterType].numberOfMotions += 1
          mpCasesTotal[presenter.id].summary[presenterType].numberOfMotions += 1
        } else if (isInquiry) {
          mpCasesByLthing[lthing][presenter.id].summary[presenterType].numberOfInquiriesAsked += 1
          mpCasesTotal[presenter.id].summary[presenterType].numberOfInquiriesAsked += 1
        } else if (isInquiryAnswer) {
          mpCasesByLthing[lthing][presenter.id].summary[presenterType].numberOfInquiriesAnswered += 1
          mpCasesTotal[presenter.id].summary[presenterType].numberOfInquiriesAnswered += 1
        }

        mpCasesByLthing[lthing][presenter.id].summary[presenterType].total += 1
        mpCasesTotal[presenter.id].summary[presenterType].total += 1
      })
    }
  })

  console.log(Object.keys(allTypes).sort())

  writeToFile(mpCasesByLthing, 'data/export-v2/by-lthing/mp-case-summaries.json', true)
  writeToFile(mpCasesTotal, 'data/export-v2/total/mp-case-summaries.json', true)
}
