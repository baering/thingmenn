import createMpSummary from './mp-summary'
import createMpPositionLookup from './positions'
// TODO: add analyzer to the repo
// import createMpNounLookup from './speeches'
import createMpSpeechStatisticSummary from './speech-statistics'
import createPartySummaries from './parties'
import createTopCharts from './top-charts'
import createCaseSummaries from './documents'

import { getProcessArguments } from '../utility/process'

const defaultItems = [
  'documents',
  'mps',
  'positions',
  'speeches',
  'speechStatistics',
  'top',
]

function process(config) {
  if (config.documents) {
    console.log('Processing documents')
    createCaseSummaries()
  }

  if (config.mps) {
    console.log('Processing mps')
    createMpSummary()
  }

  if (config.speeches) {
    console.log('Processing mp nouns')
    // createMpNounLookup()
  }

  if (config.speechStatistics) {
    console.log('Processing speech statistics')
    createMpSpeechStatisticSummary()
  }

  if (config.positions) {
    console.log('Processing mp positions')
    createMpPositionLookup()
  }

  if (config.parties) {
    console.log('Processing parties')
    createPartySummaries()
  }

  if (config.top) {
    console.log('Processing top charts')
    createTopCharts()
  }
}

const itemsToProcess = getProcessArguments(defaultItems)
process(itemsToProcess)
