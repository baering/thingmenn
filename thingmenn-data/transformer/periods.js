import { loadFile, writeToFile } from '../utility/file'
import { getLthingById } from '../utility/lthing'
import { EXPORT_PATH } from './constants'

const getLthingStartDate = (lthingId) => {
  const lthingInfo = getLthingById(lthingId)

  if (!lthingInfo) {
    return null
  }

  return lthingInfo.start
}

const getLthingEndDate = (lthingId) => {
  const lthingInfo = getLthingById(lthingId)

  if (!lthingInfo) {
    return null
  }

  return lthingInfo.end
}

export function createPeriodFileTransformer() {
  const terms = loadFile('manual/terms.json')

  const periods = []

  for (const term of terms) {
    periods.push({
      id: term.id,
      duration: term.id,
      start: getLthingStartDate(term.lthings[term.lthings.length - 1]),
      end: getLthingEndDate(term.lthings[0]),
      isTerm: true,
      lthings: term.lthings,
    })

    periods.push(...term.lthings.map((lthing) => getLthingById(lthing)))
  }

  writeToFile(periods, `${EXPORT_PATH}/periods/list.json`)
}
