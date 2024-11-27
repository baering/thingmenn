const DEFAULT_OPTIONS = {
  skipTerms: false,
  skipLthings: false,
}

export function generateLthingList(
  periodIds,
  periods,
  lthingLookup,
  resourcePath,
  options = DEFAULT_OPTIONS,
) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  return periods
    .filter((period) => {
      if (period.isTerm) {
        if (mergedOptions.skipTerms) {
          return false
        }
        const lthingsInTerm = period.lthings.map((lthing) => Number(lthing))

        return lthingsInTerm.some((lthing) => periodIds.includes(lthing))
      }

      if (mergedOptions.skipLthings) {
        return false
      }

      return periodIds.includes(Number(period.id))
    })
    .map((period) => {
      const item = {}

      if (period.isTerm) {
        item.name = `Kjörtímabil ${period.id}`
      } else {
        item.year = lthingLookup[period.id].start.split('.')[2]
        item.thing = period.id
      }

      return {
        ...item,
        url: `${resourcePath ? '/' : ''}${resourcePath}/thing/${period.id}`,
      }
    })
}
