import fs from 'fs'
import path from 'path'

export function getDir(filename) {
  const parts = filename.split('/')
  const dir = parts.slice(0, parts.length - 1).join('/')

  return dir
}

export function writeToFile(data, filename, pretty = false) {
  let stringified
  if (pretty) {
    stringified = JSON.stringify(data, null, '\t')
  } else {
    stringified = JSON.stringify(data)
  }

  const dir = getDir(filename)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(filename, stringified)
}

export function loadFile(filename) {
  let fileContent = null
  try {
    fileContent = fs.readFileSync(filename, 'utf8')
  } catch (e) {
    // nothing
  }

  if (fileContent && fileContent.length) {
    return JSON.parse(fileContent)
  }
  return null
}
