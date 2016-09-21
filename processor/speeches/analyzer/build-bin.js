require('babel-register')

import LineByLineReader from 'line-by-line'
import fs from 'fs'

function cleanWord(word) {
  const cleaned = word.replace(/-/g, '')
  return cleaned.toLowerCase()
}

function mapWord(data) {
  // headword;binId;wordType;section;word;grammarTag
  const parts = data.split(';')

  return {
    headWord: cleanWord(parts[0]),
    type: cleanWord(parts[2]),
    form: cleanWord(parts[4])
  }
}

function readFile(path, resolve, reject) {
  const reader = new LineByLineReader(path)

  const adjectiveLookup = {}
  const nounLookup = {}

  const adjectives = []
  const nouns = []

  reader.on('error', (error) => {
    reject(error)
  })

  reader.on('line', (line) => {
    const word = mapWord(line)

    if (word.type === 'lo') {
      if (!adjectiveLookup[word.form]) {
        adjectives.push([word.headWord, word.form])
        adjectiveLookup[word.form] = true
      }
    } else if (word.type === 'kk' || word.type === 'kvk' || word.type === 'hk') {
      if (!nounLookup[word.form]) {
        nouns.push([word.headWord, word.form])
        nounLookup[word.form] = true
      }
    }
  })

  reader.on('end', () => {
    resolve({
      adjectives,
      nouns
    })
  })
}

function writeToFile(path, object, callback) {
  fs.writeFile(path, JSON.stringify(object), callback)
}

readFile('./analyzer/database/data/bin-all-words.csv', (result) => {
  writeToFile('./analyzer/database/nouns.json', result.nouns, (error) => {
    if (error) {
      console.log(error)
    }
  })

  writeToFile('./analyzer/database/adjectives.json', result.adjectives, (error) => {
    if (error) {
      console.log(error)
    }
  })
}, (error) => {
  console.log(error)
})
