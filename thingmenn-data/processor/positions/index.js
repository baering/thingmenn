import { loadFile, writeToFile } from '../../utility/file'

import {
  generateMpVotePositions,
  generatePartyVotePositions,
  generateMpSpeechPositions,
  generateMpDocumentPositions,
  generatePartyPositions,
} from './helpers'

const classifications = loadFile('data/v2/classifications.json')

const sectionLookup = {}
const subjectLookup = {}

classifications.sections.forEach(section => {
  sectionLookup[section.id] = section
})
classifications.subjects.forEach(subject => {
  subjectLookup[subject.id] = subject
})

const votings = loadFile('data/v2/votings.json')
const speechClassificiatonsByLthing = loadFile('data/v2/speech-classifications-by-lthing.json')

const caseClassificationLookup = {}
Object.keys(votings).forEach(lthing => {
  caseClassificationLookup[lthing] = {}

  votings[lthing].cases.forEach(currentCase => {
    caseClassificationLookup[lthing][currentCase.id] = currentCase.classification
  })
})

export default function process() {
  const {
    mpVotePositionsByLthing,
    mpVotePositionsTotal,
  } = generateMpVotePositions(
    votings,
    caseClassificationLookup,
    sectionLookup
  )

  writeToFile(mpVotePositionsByLthing, 'data/export-v2/by-lthing/mp-vote-positions.json', true)
  writeToFile(mpVotePositionsTotal, 'data/export-v2/total/mp-vote-positions.json', true)

  const {
    partyVotePositionsByLthing,
    partyVotePositionsTotal,
  } = generatePartyVotePositions(
    votings,
    caseClassificationLookup,
    sectionLookup
  )

  writeToFile(partyVotePositionsByLthing, 'data/export-v2/by-lthing/party-vote-positions.json', true)
  writeToFile(partyVotePositionsTotal, 'data/export-v2/total/party-vote-positions.json', true)

  const {
    mpSpeechPositionsByLthing,
    mpSpeechPositionsTotal,
  } = generateMpSpeechPositions(
    speechClassificiatonsByLthing,
    caseClassificationLookup,
    sectionLookup,
  )

  writeToFile(mpSpeechPositionsByLthing, 'data/export-v2/by-lthing/mp-speech-positions.json', true)
  writeToFile(mpSpeechPositionsTotal, 'data/export-v2/total/mp-speech-positions.json', true)

  const partySpeechPositions = generatePartyPositions(
    mpSpeechPositionsByLthing
  )

  writeToFile(partySpeechPositions.byLthing, 'data/export-v2/by-lthing/party-speech-positions.json', true)
  writeToFile(partySpeechPositions.total, 'data/export-v2/total/party-speech-positions.json', true)

  const documents = loadFile('data/v2/documents.json')

  const {
    mpDocumentPositionsByLthing,
    mpDocumentPositionsTotal,
  } = generateMpDocumentPositions(
    documents,
    caseClassificationLookup,
    sectionLookup,
  )

  writeToFile(mpDocumentPositionsByLthing, 'data/export-v2/by-lthing/mp-document-positions.json', true)
  writeToFile(mpDocumentPositionsTotal, 'data/export-v2/total/mp-document-positions.json', true)

  const partyDocumentPositions = generatePartyPositions(
    mpDocumentPositionsByLthing
  )

  writeToFile(partyDocumentPositions.byLthing, 'data/export-v2/by-lthing/party-document-positions.json', true)
  writeToFile(partyDocumentPositions.total, 'data/export-v2/total/party-document-positions.json', true)
}
