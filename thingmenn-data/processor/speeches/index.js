import { writeToFile, loadFile } from '../../utility/file'
import uninflectableWordMap from './analyzer/maps/uninflectable-word-map'
import pronounMap from './analyzer/maps/pronoun-map'
import verbMap from './analyzer/maps/verb-map'
import adverbMap from './analyzer/maps/adverb-map'
import ignoreWordsMap from './analyzer/maps/words-to-ignore'

const alphabet = 'aábcdðeéfghiíjklmnoóprstuúvxyýþæöAÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖqQwWxXzZ'
const cleanWordLetters = `${alphabet}0123456789`

import { isNoun, getNounRoot } from './analyzer/analyzer'

function wordIsOfInterest(word) {
  const wordIsUninflectable = uninflectableWordMap[word]
  const wordIsPronoun = pronounMap[word]
  const wordIsVerb = verbMap[word]
  const wordIsAdverb = adverbMap[word]
  const wordIsNoun = isNoun(word)

  const isOfInterest = !(wordIsUninflectable || wordIsPronoun || wordIsVerb || wordIsAdverb)

  return isOfInterest && wordIsNoun
}

function cleanWord(word) {
  const trimmed = word.trim()
  const lowerCaseWord = trimmed.toLowerCase()
  const allCharacters = lowerCaseWord.split('')
  const allowedCharacters = allCharacters.filter(character => cleanWordLetters.includes(character))
  return allowedCharacters.join('').trim()
}

export default function createMpNounLookup() {
  const allMpSpeeches = loadFile('data/all-speeches.json')

  const mpNounLookup = {}
  allMpSpeeches.forEach(mpSpeeches => {
    const currentMpId = mpSpeeches.mpId
    mpNounLookup[currentMpId] = {}

    mpSpeeches.speeches.forEach(speech => {
      const nouns = speech.split(' ').map(word => cleanWord(word))

      nouns.filter(word => wordIsOfInterest(word)).forEach(noun => {
        const nounRoot = getNounRoot(noun)
        if (!mpNounLookup[currentMpId][nounRoot]) {
          mpNounLookup[currentMpId][nounRoot] = 0
        }

        mpNounLookup[currentMpId][nounRoot]++
      })
    })
  })

  const topNounsForAll = {}
  const topNouns = []
  const mpIds = Object.keys(mpNounLookup)
  mpIds.forEach(mpId => {
    const nouns = Object.keys(mpNounLookup[mpId])
    const nounCounters = []
    nouns.forEach(noun => {
      if (!ignoreWordsMap[noun]) {
        nounCounters.push({
          noun,
          count: mpNounLookup[mpId][noun],
        })

        if (!topNounsForAll[noun]) {
          topNounsForAll[noun] = mpNounLookup[mpId][noun]
        } else {
          topNounsForAll[noun] += mpNounLookup[mpId][noun]
        }
      }
    })

    const topNounsForMp = nounCounters.sort((a, b) => b.count - a.count).slice(0, 10)
    topNouns.push({
      mpId,
      nouns: topNounsForMp.map(nounCounter => `${nounCounter.noun}: ${nounCounter.count}`),
    })
  })

  const allNouns = Object.keys(topNounsForAll)
  const allNounCounters = []
  allNouns.forEach(noun => {
    allNounCounters.push({
      noun,
      count: topNounsForAll[noun],
    })
  })

  writeToFile({
    topForAll: allNounCounters.sort((a, b) => b.count - a.count).slice(0, 50).map(noun => `${noun.noun}: ${noun.count}`),
    topMpNouns: topNouns,
  }, 'data/mp-noun-lookup.json', true)
}
