import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/v2/mps.json')
const mpIndexLookup = {}
mps.forEach((mp, index) => {
  mpIndexLookup[mp.id] = index
})

const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')
const mpToPartyLookup = {}
Object.keys(mpsByLthing).forEach(lthing => {
  const mpsInLthing = mpsByLthing[lthing]
  mpsInLthing.forEach(mp => {
    if (mpToPartyLookup[lthing] === undefined) {
      mpToPartyLookup[lthing] = {}
    }

    mpToPartyLookup[lthing][mp.id] = mp.partyId
  })
})

const votings = loadFile('data/v2/votings.json')

function createVoteSummary(voteSummary, id) {
  const summary = voteSummary[id]
  Object.keys(summary.voteTypes).forEach(voteType => {
    const numberOfVotesForType = summary.voteTypes[voteType]

    if (voteType === 'já' || voteType === 'nei') {
      summary.voteSummary.numberOfStandsTaken += numberOfVotesForType
    } else if (voteType === 'greiðir ekki atkvæði') {
      summary.voteSummary.numberOfIdleVotes += numberOfVotesForType
    } else if (voteType === 'fjarverandi') {
      summary.voteSummary.numberOfAway += numberOfVotesForType
    } else {
      summary.voteSummary.numberOfAbsent += numberOfVotesForType
    }

    summary.voteSummary.numberOfVotes += numberOfVotesForType
  })

  const numberOfVotes = summary.voteSummary.numberOfVotes
  const standsTaken = summary.voteSummary.numberOfStandsTaken / numberOfVotes
  const idle = summary.voteSummary.numberOfIdleVotes / numberOfVotes
  const away = summary.voteSummary.numberOfAway / numberOfVotes
  const absent = summary.voteSummary.numberOfAbsent / numberOfVotes
  summary.votePercentages = {
    standsTaken: parseFloat((standsTaken * 100).toFixed(2)),
    idle: parseFloat((idle * 100).toFixed(2)),
    away: parseFloat((away * 100).toFixed(2)),
    absent: parseFloat((absent * 100).toFixed(2)),
  }
}

function initializeVoteCounterIfNeeded(counter, id) {
  if (counter[id] === undefined) {
    counter[id] = {
      id,
      voteSummary: {
        numberOfVotes: 0,
        numberOfStandsTaken: 0,
        numberOfAway: 0,
        numberOfAbsent: 0,
        numberOfIdleVotes: 0,
      },
      voteTypes: {},
    }
  }
}

function incrementVoteType(counter, voteType) {
  if (counter[voteType] === undefined) {
    counter[voteType] = 0
  }

  counter[voteType] += 1
}

export default function process() {
  const mpVoteLogByLthing = {}

  const mpVoteCounter = {}
  const mpByLthingVoteCounter = {}

  const partyVoteCounter = {}
  const partyByLthingVoteCounter = {}

  const lthings = Object.keys(votings)

  for (const lthing of lthings) {
    for (const voteInfo of votings[lthing].votes) {
      const { mpId, vote, votingId } = voteInfo

      if (mpVoteLogByLthing[lthing] === undefined) {
        mpVoteLogByLthing[lthing] = {}
      }

      if (mpVoteLogByLthing[lthing][mpId] === undefined) {
        mpVoteLogByLthing[lthing][mpId] = {}
      }

      mpVoteLogByLthing[lthing][mpId][votingId] = vote

      if (mpByLthingVoteCounter[lthing] === undefined) {
        mpByLthingVoteCounter[lthing] = {}
      }

      if (partyByLthingVoteCounter[lthing] === undefined) {
        partyByLthingVoteCounter[lthing] = {}
      }

      initializeVoteCounterIfNeeded(mpVoteCounter, mpId)
      incrementVoteType(mpVoteCounter[mpId].voteTypes, vote)

      initializeVoteCounterIfNeeded(mpByLthingVoteCounter[lthing], mpId)
      incrementVoteType(mpByLthingVoteCounter[lthing][mpId].voteTypes, vote)

      const mpPartyId = mpToPartyLookup[lthing][mpId]

      initializeVoteCounterIfNeeded(partyVoteCounter, mpPartyId)
      incrementVoteType(partyVoteCounter[mpPartyId].voteTypes, vote)

      initializeVoteCounterIfNeeded(partyByLthingVoteCounter[lthing], mpPartyId)
      incrementVoteType(partyByLthingVoteCounter[lthing][mpPartyId].voteTypes, vote)
    }
  }

  Object.keys(mpVoteCounter).forEach(mpId => {
    createVoteSummary(mpVoteCounter, mpId)
  })

  for (const lthing of lthings) {
    Object.keys(mpByLthingVoteCounter[lthing]).forEach(mpId => {
      createVoteSummary(mpByLthingVoteCounter[lthing], mpId)
    })
  }

  Object.keys(partyVoteCounter).forEach(partyId => {
    createVoteSummary(partyVoteCounter, partyId)
  })

  for (const lthing of lthings) {
    Object.keys(partyByLthingVoteCounter[lthing]).forEach(partyId => {
      createVoteSummary(partyByLthingVoteCounter[lthing], partyId)
    })
  }


  writeToFile(mpVoteCounter, 'data/export-v2/mp-vote-summaries.json', true)
  writeToFile(mpByLthingVoteCounter, 'data/export-v2/mp-vote-summaries-by-lthing.json', true)
  writeToFile(partyVoteCounter, 'data/export-v2/party-vote-summaries.json', true)
  writeToFile(partyByLthingVoteCounter, 'data/export-v2/party-vote-summaries-by-lthing.json', true)
}
