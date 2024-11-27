import { loadFile, writeToFile } from '../../utility/file'
import { getTermFromId, lthingToTerm } from '../../utility/lthing'

import {
  initializeVoteCounterIfNeeded,
  incrementVoteType,
  createVoteSummary,
  createSimilarVoteLookup,
  createSortedMpVoteSimilarityLookup,
  createTotalSimilarVoteLookup,
  updateAbsentVoteTimeMatrixSummary,
} from './helpers'

const mps = loadFile('data/v2/mps.json')
const mpLookup = {}
mps.forEach((mp) => {
  mpLookup[mp.id] = mp
})

const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')
const mpToPartyLookup = {}
Object.keys(mpsByLthing).forEach((lthing) => {
  const mpsInLthing = mpsByLthing[lthing]
  mpsInLthing.forEach((mp) => {
    if (mpToPartyLookup[lthing] === undefined) {
      mpToPartyLookup[lthing] = {}
    }

    mpToPartyLookup[lthing][mp.id] = mp.partyId
  })
})

const votings = loadFile('data/v2/votings.json')

export default function process() {
  const mpVoteLogByLthing = {}

  const mpTotalVoteCounter = {}
  const mpByLthingVoteCounter = {}

  const partyTotalVoteCounter = {}
  const partyByLthingVoteCounter = {}

  const mpAbsentVoteWeekdayTimeMatrixTotal = {}
  const mpAbsentVoteWeekdayTimeMatrixByLthing = {}

  const lthings = Object.keys(votings)

  for (const lthing of lthings) {
    mpAbsentVoteWeekdayTimeMatrixByLthing[lthing] = {}

    const termForLthing = lthingToTerm(lthing)

    if (mpAbsentVoteWeekdayTimeMatrixTotal[termForLthing.id] === undefined) {
      mpAbsentVoteWeekdayTimeMatrixTotal[termForLthing.id] = {}
    }

    if (mpTotalVoteCounter[termForLthing.id] === undefined) {
      mpTotalVoteCounter[termForLthing.id] = {}
    }

    if (partyTotalVoteCounter[termForLthing.id] === undefined) {
      partyTotalVoteCounter[termForLthing.id] = {}
    }

    updateAbsentVoteTimeMatrixSummary(
      mpAbsentVoteWeekdayTimeMatrixTotal[termForLthing.id],
      votings[lthing].votings,
      votings[lthing].votes,
      mpToPartyLookup[lthing],
    )
    updateAbsentVoteTimeMatrixSummary(
      mpAbsentVoteWeekdayTimeMatrixByLthing[lthing],
      votings[lthing].votings,
      votings[lthing].votes,
      mpToPartyLookup[lthing],
    )

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

      initializeVoteCounterIfNeeded(mpTotalVoteCounter[termForLthing.id], mpId)
      incrementVoteType(
        mpTotalVoteCounter[termForLthing.id][mpId].voteTypes,
        vote,
      )

      initializeVoteCounterIfNeeded(mpByLthingVoteCounter[lthing], mpId)
      incrementVoteType(mpByLthingVoteCounter[lthing][mpId].voteTypes, vote)

      const mpPartyId = mpToPartyLookup[lthing][mpId]

      initializeVoteCounterIfNeeded(
        partyTotalVoteCounter[termForLthing.id],
        mpPartyId,
      )
      incrementVoteType(
        partyTotalVoteCounter[termForLthing.id][mpPartyId].voteTypes,
        vote,
      )

      initializeVoteCounterIfNeeded(partyByLthingVoteCounter[lthing], mpPartyId)
      incrementVoteType(
        partyByLthingVoteCounter[lthing][mpPartyId].voteTypes,
        vote,
      )
    }
  }

  writeToFile(
    mpAbsentVoteWeekdayTimeMatrixTotal,
    'data/export-v2/total/mp-absent-day-time-summary.json',
    true,
  )

  writeToFile(
    mpAbsentVoteWeekdayTimeMatrixByLthing,
    'data/export-v2/by-lthing/mp-absent-day-time-summary.json',
    true,
  )

  Object.keys(mpTotalVoteCounter).forEach((termId) => {
    Object.keys(mpTotalVoteCounter[termId]).forEach((mpId) => {
      createVoteSummary(mpTotalVoteCounter[termId], mpId)
    })
  })

  for (const lthing of lthings) {
    Object.keys(mpByLthingVoteCounter[lthing]).forEach((mpId) => {
      createVoteSummary(mpByLthingVoteCounter[lthing], mpId)
    })
  }

  Object.keys(partyTotalVoteCounter).forEach((termId) => {
    Object.keys(partyTotalVoteCounter[termId]).forEach((partyId) => {
      createVoteSummary(partyTotalVoteCounter[termId], partyId)
    })
  })

  for (const lthing of lthings) {
    Object.keys(partyByLthingVoteCounter[lthing]).forEach((partyId) => {
      createVoteSummary(partyByLthingVoteCounter[lthing], partyId)
    })
  }

  writeToFile(
    mpTotalVoteCounter,
    'data/export-v2/total/mp-vote-summaries.json',
    true,
  )
  writeToFile(
    mpByLthingVoteCounter,
    'data/export-v2/by-lthing/mp-vote-summaries.json',
    true,
  )
  writeToFile(
    partyTotalVoteCounter,
    'data/export-v2/total/party-vote-summaries.json',
    true,
  )
  writeToFile(
    partyByLthingVoteCounter,
    'data/export-v2/by-lthing/party-vote-summaries.json',
    true,
  )

  const { similarMpLookup, differentMpLookup } = createSimilarVoteLookup(
    mps,
    mpVoteLogByLthing,
  )

  const sortedSimilarMpLookupsByLthing = {}
  const sortedDifferentMpLookupsByLthing = {}

  for (const lthing of lthings) {
    sortedSimilarMpLookupsByLthing[lthing] = createSortedMpVoteSimilarityLookup(
      similarMpLookup[lthing],
      mpLookup,
      mpByLthingVoteCounter[lthing],
      lthing,
    )

    sortedDifferentMpLookupsByLthing[lthing] =
      createSortedMpVoteSimilarityLookup(
        differentMpLookup[lthing],
        mpLookup,
        mpByLthingVoteCounter[lthing],
        lthing,
      )
  }

  const sortedMpTotalSimilarVotes = {}

  Object.keys(mpTotalVoteCounter).forEach((termId) => {
    const term = getTermFromId(termId)

    console.log('Processing term to create similar vote lookup', termId)
    const mpTotalSimilarVotes = createTotalSimilarVoteLookup(
      similarMpLookup,
      term.lthings,
    )

    if (sortedMpTotalSimilarVotes[termId] === undefined) {
      sortedMpTotalSimilarVotes[termId] = {}
    }

    sortedMpTotalSimilarVotes[termId] = createSortedMpVoteSimilarityLookup(
      mpTotalSimilarVotes,
      mpLookup,
      mpTotalVoteCounter[termId],
    )
  })

  const sortedTotalDifferentVotes = {}

  Object.keys(mpTotalVoteCounter).forEach((termId) => {
    const term = getTermFromId(termId)

    console.log('Processing term to create different vote lookup', termId)
    const mpTotalDifferentVotes = createTotalSimilarVoteLookup(
      differentMpLookup,
      term.lthings,
    )

    if (sortedTotalDifferentVotes[termId] === undefined) {
      sortedTotalDifferentVotes[termId] = {}
    }

    sortedTotalDifferentVotes[termId] = createSortedMpVoteSimilarityLookup(
      mpTotalDifferentVotes,
      mpLookup,
      mpTotalVoteCounter[termId],
    )
  })

  writeToFile(
    sortedMpTotalSimilarVotes,
    'data/export-v2/total/mp-similar-votes.json',
    true,
  )
  writeToFile(
    sortedTotalDifferentVotes,
    'data/export-v2/total/mp-different-votes.json',
    true,
  )

  writeToFile(
    sortedSimilarMpLookupsByLthing,
    'data/export-v2/by-lthing/mp-similar-votes.json',
    true,
  )
  writeToFile(
    sortedDifferentMpLookupsByLthing,
    'data/export-v2/by-lthing/mp-different-votes.json',
    true,
  )
}
