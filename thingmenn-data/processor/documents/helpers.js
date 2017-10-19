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
