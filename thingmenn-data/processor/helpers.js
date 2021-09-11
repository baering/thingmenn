import { loadFile } from '../utility/file'

export function getMpToPartyLookup() {
  const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')
  const mps = loadFile('data/v2/mps.json')
  const mpToPartyLookup = {}
  Object.keys(mpsByLthing).forEach((lthing) => {
    const mpsInLthing = mpsByLthing[lthing]
    mpsInLthing.forEach((mp) => {
      if (mpToPartyLookup[lthing] === undefined) {
        mpToPartyLookup[lthing] = {}
      }

      mpToPartyLookup[lthing][mp.id] = mp.partyId
    })
  })

  mpToPartyLookup.allt = {}
  mps.forEach((mp) => {
    if (mp.lthings && mp.lthings.length) {
      mpToPartyLookup.allt[mp.id] = mp.lthings[0].partyId
    }
  })

  return mpToPartyLookup
}
