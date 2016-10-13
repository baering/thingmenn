import { loadFile, writeToFile } from '../../utility/file'
import createVoteSummary from './votes'

// const mps = loadFile('data/mps.json')
// const subjects = loadFile('data/subjects.json')
// const allVotes = loadFile('data/all-votes.json')

export default function createMpSummary() {
  createVoteSummary()
}
