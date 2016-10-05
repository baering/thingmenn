import fs from 'fs'

export function writeToFile(data, filename, pretty = false) {
  let stringified
  if (pretty) {
    stringified = JSON.stringify(data, null, '\t')
  } else {
    stringified = JSON.stringify(data)
  }

  fs.writeFile(filename, stringified, error => {
    if (error) {
      console.log(`Error writing to file: ${error}`)
    } else {
      console.log('Wrote data to file')
    }
  })
}

export function loadFile(filename) {
  const fileContent = fs.readFileSync(filename, 'utf8')

  if (fileContent.length) {
    return JSON.parse(fileContent)
  }
  return null
}
