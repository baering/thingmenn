import { loadFile } from './file'

let lthings
let terms

const lthingToTermLookup = {}

function loadData() {
  if (lthings && terms) {
    return
  }

  lthings = loadFile('./data/v2/lthings.json')
  terms = loadFile('./manual/terms.json')

  for (const term of terms) {
    for (const lthing of term.lthings) {
      lthingToTermLookup[lthing] = term
    }
  }
}

export function getLthingById(lthingId) {
  loadData()
  return lthings.find((lthing) => Number(lthing.id) === Number(lthingId))
}

export function lthingToTerm(lthing) {
  loadData()
  return lthingToTermLookup[lthing]
}

export function getTermFromId(termId) {
  loadData()
  return terms.find((term) => term.id === termId)
}
