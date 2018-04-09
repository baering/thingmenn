import { loadFile } from '../utility/file'

export function fetchExistingData(fileUrl, lthings, options = {}) {
  const existingData = loadFile(fileUrl)

  console.log('Fetching existing data for:', fileUrl)
  if (existingData !== null) {
    console.log('Found: ', Object.keys(existingData).join(', '))
    console.log('\tof type:', typeof existingData)
    if (options.resetCurrentLthings) {
      console.log('resetting lthings being fetched now', lthings)
      lthings.forEach((lthing) => {
        existingData[lthing] = undefined
      })
    }
  } else {
    console.log('nothing existed')
  }

  return existingData
}
