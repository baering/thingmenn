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
      presenter: {
        numberOfBills: 0,
        numberOfMotions: 0,
        numberOfInquiriesAsked: 0,
        numberOfInquiriesAnswered: 0,
        total: 0,
      },
      coPresenter: {
        numberOfBills: 0,
        numberOfMotions: 0,
        numberOfInquiriesAsked: 0,
        numberOfInquiriesAnswered: 0,
        total: 0,
      },
    },
  }
}
