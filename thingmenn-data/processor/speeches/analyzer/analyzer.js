function loadWordData(path) {
  return require(path)
}

function populateLookupMap(path) {
  const items = loadWordData(path)

  const lookup = {}
  items.forEach(item => lookup[item[1]] = item[0])

  return lookup
}

function populateLookupMaps() {
  return {
    nounLookup: populateLookupMap('./database/nouns.json'),
    adjectiveLookup: populateLookupMap('./database/adjectives.json')
  }
}

const { nounLookup, adjectiveLookup } = populateLookupMaps()

export function findNouns(words) {
  const result = []

  words.forEach(word => {
    if (nounLookup[word]) {
      result.push({
        root: nounLookup[word],
        form: word
      })
    }
  })

  return result
}

export function findAdjectives(words) {
  const result = []

  words.forEach(word => {
    if (adjectiveLookup[word]) {
      result.push({
        root: adjectiveLookup[word],
        form: word
      })
    }
  })

  return result
}

export function isNoun(word) {
  return nounLookup[word] !== undefined
}

export function getNounRoot(word) {
  return nounLookup[word]
}
