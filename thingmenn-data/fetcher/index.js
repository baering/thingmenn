import { writeToFile } from '../utility/file'

import fetchMps from './mps'
import fetchVotes from './votes'
import fetchSubjects from './subjects'
import fetchSpeechStatistics from './speech-statistics'
// TODO: add analyzer to the repo
// import fetchSpeeches from './speeches'

const allThingsToProcess = ['mps', 'votes', 'subjects', 'speechStatistics', 'speeches']

function readArguments() {
  const config = {}
  if (process.argv.length > 2) {
    const customThingsToProcess = process.argv.slice(2, process.argv.length)
    customThingsToProcess.forEach(item => config[item] = true)
  } else {
    allThingsToProcess.forEach(item => config[item] = true)
  }

  return config
}

async function fetch(config) {
  if (config.mps) {
    console.log('Fetching mps')
    await fetchMps()
  }

  if (config.votes) {
    console.log('Fetching votes')
    await fetchVotes()
  }

  if (config.subjects) {
    console.log('Fetching subjects')
    await fetchSubjects()
  }

  if (config.speechStatistics) {
    console.log('Fetching speech statistics')
    await fetchSpeechStatistics()
  }

  if (config.speeches) {
    // TODO: add analyzer to the repo
    console.log('Would be speeches, but needs analyzer')
    // const speeches = await fetchSpeeches()
    // writeToFile(data, 'data/all-votes-for-term.json')
  }
}

fetch(readArguments())
