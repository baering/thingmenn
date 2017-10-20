import createMpSummary from './mp-summary'
import createMpPositionLookup from './positions'
import createMpSpeechStatisticSummary from './speech-statistics'
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

  if (config.speechStatistics) {
    console.log('Processing speech statistics')
    createMpSpeechStatisticSummary()
  }

  if (config.positions) {
    console.log('Processing mp positions')
    createMpPositionLookup()
  }

  if (config.top) {
    console.log('Processing top charts')
    createTopCharts()
  }
}

const itemsToProcess = getProcessArguments(defaultItems)
process(itemsToProcess)
