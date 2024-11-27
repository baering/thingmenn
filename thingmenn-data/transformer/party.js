import { loadFile, writeToFile } from '../utility/file'
import { EXPORT_PATH } from './constants'

const getPartyListDetails = (party) => ({
  id: party.id,
  name: party.name,
  imagePath: party.imagePath,
})

export function createPartyFileTransformer() {
  const parties = loadFile('manual/parties.json')

  const partiesByLthing = {}
  parties.forEach((party) => {
    party.lthings.forEach(({ lthing }) => {
      if (!partiesByLthing[lthing]) {
        partiesByLthing[lthing] = []
      }
      partiesByLthing[lthing].push(getPartyListDetails(party))
    })
  })

  writeToFile(parties, `${EXPORT_PATH}/parties/list.json`)

  for (const lthing of Object.keys(partiesByLthing)) {
    writeToFile(
      partiesByLthing[lthing],
      `${EXPORT_PATH}/parties/${lthing}/list.json`,
    )
  }
}
