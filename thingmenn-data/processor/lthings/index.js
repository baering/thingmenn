import { loadFile, writeToFile } from '../../utility/file'

export default function process() {
  const lthings = loadFile('data/v2/lthings.json')
  const lthingsUsed = loadFile('data/v2/lthings-used.json')

  const lthingLookup = {}
  lthings.forEach(lthing => {
    lthingLookup[lthing.id] = lthing
  })

  const lthingsWithDetails = lthingsUsed.map(lthingId => lthingLookup[lthingId])
  writeToFile(lthingsWithDetails, 'data/export-v2/lthings.json', true)
}
