import { loadFile } from '../utility/file'

export function getMpToPartyLookup() {
  const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')
  const mpToPartyLookup = {}
  Object.keys(mpsByLthing).forEach(lthing => {
    const mpsInLthing = mpsByLthing[lthing]
    mpsInLthing.forEach(mp => {
      if (mpToPartyLookup[lthing] === undefined) {
        mpToPartyLookup[lthing] = {}
      }

      mpToPartyLookup[lthing][mp.id] = mp.partyId
    })
  })

  return mpToPartyLookup
}
