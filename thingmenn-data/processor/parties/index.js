import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/mps.json')
const mpVoteSummaries = loadFile('data/export/mp-vote-summaries.json')

const mpIdToParty = {}

function getPartyNames() {
  const partyNames = {}
  mps.forEach(mp => {
    partyNames[mp.party] = true
    mpIdToParty[mp.id] = mp.party
  })
  return Object.keys(partyNames)
}

function updateVoteSummary(voteSummary, mpVoteSummary, mp) {
  if (!voteSummary[mp.party]) {
    voteSummary[mp.party] = {
      voteSummary: {
        numberOfAway: 0,
        numberOfIdleVotes: 0,
        numberOfStandsTaken: 0,
        numberOfVotes: 0,
      },
      voteTypes: {}
    }
  }

  voteSummary[mp.party].voteSummary.numberOfAway += mpVoteSummary.voteSummary.numberOfAway
  voteSummary[mp.party].voteSummary.numberOfIdleVotes += mpVoteSummary.voteSummary.numberOfIdleVotes
  voteSummary[mp.party].voteSummary.numberOfStandsTaken += mpVoteSummary.voteSummary.numberOfStandsTaken
  voteSummary[mp.party].voteSummary.numberOfVotes += mpVoteSummary.voteSummary.numberOfVotes

  const mpVoteTypes = Object.keys(mpVoteSummary.voteTypes)
  mpVoteTypes.forEach(voteType => {
    if (!voteSummary[mp.party].voteTypes[voteType]) {
      voteSummary[mp.party].voteTypes[voteType] = 0
    }
    voteSummary[mp.party].voteTypes[voteType] += mpVoteSummary.voteTypes[voteType]
  })
}

function calculateVotePercentages(partyNames, voteSummary) {
  partyNames.forEach(party => {
    const numberOfVotes = voteSummary[party].voteSummary.numberOfVotes
    const standsTaken = voteSummary[party].voteSummary.numberOfStandsTaken / numberOfVotes
    const idle = voteSummary[party].voteSummary.numberOfIdleVotes / numberOfVotes
    const away = voteSummary[party].voteSummary.numberOfAway / numberOfVotes
    voteSummary[party].votePercentages = {
      standsTaken: parseFloat((standsTaken * 100).toFixed(1)),
      idle: parseFloat((idle * 100).toFixed(1)),
      away: parseFloat((away * 100).toFixed(1)),
    }
  })
}

function updatePositionSummary(positionSummary, mpPositionSummary, mp) {
  if (!positionSummary[mp.party]) {
    positionSummary[mp.party] = {
      standsTaken: [],
      idle: [],
      away: [],
    }
  }
}

export default function process() {
  const voteSummary = {}
  const partyNames = getPartyNames(mps)

  mps.forEach(mp => {
    updateVoteSummary(voteSummary, mpVoteSummaries[mp.id], mp)
  })
  calculateVotePercentages(partyNames, voteSummary)

  writeToFile(voteSummary, 'data/export/party-vote-summary.json', true)
}
