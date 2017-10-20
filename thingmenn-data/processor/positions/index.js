import { loadFile, writeToFile } from '../../utility/file'

import {
  generateMpVotePositions,
  generatePartyVotePositions,
  generateMpSpeechPositionsByLthing,
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

export default async function process() {
  // const {
  //   mpVotePositionsByLthing,
  //   mpVotePositionsTotal,
  // } = generateMpVotePositions(
  //   votings,
  //   caseClassificationLookup,
  //   sectionLookup
  // )
  //
  // writeToFile(mpVotePositionsByLthing, 'data/export-v2/by-lthing/mp-vote-positions.json', true)
  // writeToFile(mpVotePositionsTotal, 'data/export-v2/total/mp-vote-positions.json', true)

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
  //
  // const mpSpeechPositionsByLthing = generateMpSpeechPositionsByLthing(
  //   speechClassificiatonsByLthing,
  //   caseClassificationLookup,
  //   sectionLookup,
  // )
  //
  // writeToFile(mpSpeechPositionsByLthing, 'data/export-v2/by-lthing/mp-speech-positions.json', true)
}
