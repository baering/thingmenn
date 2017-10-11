import { loadFile, writeToFile } from '../../utility/file'

import {
  initializeVoteCounterIfNeeded,
  incrementVoteType,
  createVoteSummary,
  createSimilarVoteLookup,
  createSortedMpVoteSimilarityLookup,
  createTotalSimilarVoteLookup,
} from './helpers'

const mps = loadFile('data/v2/mps.json')
const mpLookup = {}
mps.forEach((mp) => {
  mpLookup[mp.id] = mp
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


  writeToFile(mpVoteCounter, 'data/export-v2/total/mp-vote-summaries.json', true)
  writeToFile(mpByLthingVoteCounter, 'data/export-v2/by-lthing/mp-vote-summaries.json', true)
  writeToFile(partyVoteCounter, 'data/export-v2/total/party-vote-summaries.json', true)
  writeToFile(partyByLthingVoteCounter, 'data/export-v2/by-lthing/party-vote-summaries.json', true)

  const { similarMpLookup, differentMpLookup } = createSimilarVoteLookup(mps, mpVoteLogByLthing)

  const sortedSimilarMpLookupsByLthing = {}
  const sortedDifferentMpLookupsByLthing = {}

  const mpTotalSimilarVotes = createTotalSimilarVoteLookup(similarMpLookup, lthings)
  const mpTotalDifferentVotes = createTotalSimilarVoteLookup(differentMpLookup, lthings)

  for (const lthing of lthings) {
    sortedSimilarMpLookupsByLthing[lthing] = createSortedMpVoteSimilarityLookup(
      similarMpLookup[lthing],
      mpLookup,
      mpByLthingVoteCounter[lthing],
    )

    sortedDifferentMpLookupsByLthing[lthing] = createSortedMpVoteSimilarityLookup(
      differentMpLookup[lthing],
      mpLookup,
      mpByLthingVoteCounter[lthing]
    )
  }

  const sortedMpTotalSimilarVotes = createSortedMpVoteSimilarityLookup(
    mpTotalSimilarVotes,
    mpLookup,
    mpVoteCounter,
  )

  const sortedTotalDifferentVotes = createSortedMpVoteSimilarityLookup(
    mpTotalDifferentVotes,
    mpLookup,
    mpVoteCounter,
  )

  writeToFile(sortedMpTotalSimilarVotes, 'data/export-v2/total/mp-similar-votes.json', true)
  writeToFile(sortedTotalDifferentVotes, 'data/export-v2/total/mp-different-votes.json', true)

  writeToFile(sortedSimilarMpLookupsByLthing, 'data/export-v2/by-lthing/mp-similar-votes.json', true)
  writeToFile(sortedDifferentMpLookupsByLthing, 'data/export-v2/by-lthing/mp-different-votes.json', true)
}
