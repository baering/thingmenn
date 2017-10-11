import { loadFile, writeToFile } from '../../utility/file'

import {
  generateMpPositionsByLthing,
  generateSortedMpPositionsByLthing,
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

const caseClassificationLookup = {}
Object.keys(votings).forEach(lthing => {
  caseClassificationLookup[lthing] = {}

  votings[lthing].cases.forEach(currentCase => {
    caseClassificationLookup[lthing][currentCase.id] = currentCase.classification
  })
})

export default async function process() {
  const mpPositionsByLthing = generateMpPositionsByLthing(
    votings,
    caseClassificationLookup,
    sectionLookup
  )

  const sortedMpPositionsByLthing = generateSortedMpPositionsByLthing(mpPositionsByLthing)

  writeToFile(sortedMpPositionsByLthing, 'data/export-v2/by-lthing/mp-positions.json', true)
}
