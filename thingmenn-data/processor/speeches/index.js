import { writeToFile, loadFile } from '../../utility/file'
import uninflectableWordMap from './analyzer/maps/uninflectable-word-map'
import pronounMap from './analyzer/maps/pronoun-map'
import verbMap from './analyzer/maps/verb-map'
import adverbMap from './analyzer/maps/adverb-map'
import ignoreWordsMap from './analyzer/maps/words-to-ignore'
import { isNoun, getNounRoot } from './analyzer/analyzer'

const alphabet = 'aábcdðeéfghiíjklmnoóprstuúvxyýþæöAÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖqQwWxXzZ'
const cleanWordLetters = `${alphabet}0123456789`

console.log('Loading subjects')
const wordsInSubjects = loadFile('data/subjects-contain.json')
const subjectLookup = {}

function addToSubjectLookup(word, subjectIndex) {
  const nounRoot = getNounRoot(cleanWord(word))

  if (!nounRoot) {
    return
  }

  console.log(`Adding ${nounRoot} to subjects`)

  if (!subjectLookup[nounRoot]) {
    subjectLookup[nounRoot] = []
  }

  subjectLookup[nounRoot].push(subjectIndex)
}

wordsInSubjects.forEach((subject, index) => {
  addToSubjectLookup(subject.subject, index)
  if (subject.wordsInSubject) {
    subject.wordsInSubject.forEach(word => {
      addToSubjectLookup(word, index)
    })
  }
})
console.log('Subjects loaded')

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
  // const allMpSpeeches = loadFile('data/all-speeches.json')

  const allSpeeches = [
    {
      lthing: 143,
      speeches: loadFile('data/term/speeches-143.json'),
    },
    {
      lthing: 144,
      speeches: loadFile('data/term/speeches-144.json'),
    },
    {
      lthing: 145,
      speeches: loadFile('data/term/speeches-145.json'),
    },
  ]

  const mpNounLookup = {}
  const mpSubjectOccuranceMap = {}

  allSpeeches.forEach(term => {
    term.speeches.forEach(mpSpeeches => {
      const currentMpId = mpSpeeches.mpId
      mpNounLookup[currentMpId] = {}
      mpSubjectOccuranceMap[currentMpId] = {}

      mpSpeeches.speeches.forEach(speech => {
        const cleanedSpeech = speech.replace(/\n/g, ' ')
        // cleanedSpeech = speech.replace(/\.|\?|!/g, '')
        const nouns = cleanedSpeech.split(' ').map(word => cleanWord(word))

        nouns.filter(word => wordIsOfInterest(word)).forEach(noun => {
          const nounRoot = getNounRoot(noun)
          if (!mpNounLookup[currentMpId][nounRoot]) {
            mpNounLookup[currentMpId][nounRoot] = 0
          }

          mpNounLookup[currentMpId][nounRoot]++

          if (subjectLookup[nounRoot] && nounRoot !== 'forseti') {
            subjectLookup[nounRoot].forEach(subjectIndex => {
              if (!mpSubjectOccuranceMap[currentMpId][subjectIndex]) {
                mpSubjectOccuranceMap[currentMpId][subjectIndex] = 0
              }
              mpSubjectOccuranceMap[currentMpId][subjectIndex]++
            })
          }
        })
      })
    })
  })

  const topNounsForAll = {}
  const topNouns = []
  const mpNounLookupMap = {}
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

    const topNounsForMp = nounCounters.sort((a, b) => b.count - a.count).slice(0, 15)
    topNouns.push({
      mpId,
      nouns: topNounsForMp.map(nounCounter => `${nounCounter.noun}: ${nounCounter.count}`),
    })

    mpNounLookupMap[mpId] = topNounsForMp.map(nounCounter => {
      return {
        noun: nounCounter.noun,
        occurance: nounCounter.count,
      }
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
  }, 'data/term/mp-noun-lookup.json', true)

  writeToFile(mpNounLookupMap, 'data/export/mp-noun-lookup.json', true)

  console.log('Wrote mp-nouns to file')

  const mpSubjects = []
  mpIds.forEach(mpId => {
    const subjectIndices = Object.keys(mpSubjectOccuranceMap[mpId])

    mpSubjects.push({
      mpId,
      subjectOccurance: subjectIndices.map(subjectIndex => {
        const subjectName = wordsInSubjects[subjectIndex].subject
        const subjectOccurance = mpSubjectOccuranceMap[mpId][subjectIndex]
        return {
          name: subjectName,
          occurance: subjectOccurance,
        }
      }).sort((a, b) => {
        return b.occurance - a.occurance
      }).map(subjectOccurance => `${subjectOccurance.name}: ${subjectOccurance.occurance}`),
    })
  })

  writeToFile(mpSubjects, 'data/term/mp-subject-occurance.json', true)
}
