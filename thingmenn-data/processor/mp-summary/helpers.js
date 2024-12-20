import { getMpToPartyLookup } from '../helpers'

export function initializeVoteCounterIfNeeded(counter, id) {
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

export function incrementVoteType(counter, voteType) {
  if (counter[voteType] === undefined) {
    counter[voteType] = 0
  }

  counter[voteType] += 1
}

export function createVoteSummary(voteSummary, id) {
  const summary = voteSummary[id]
  Object.keys(summary.voteTypes).forEach((voteType) => {
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

export function createSimilarVoteLookup(mps, mpVoteLogByLthing) {
  const similarMpLookup = {}
  const differentMpLookup = {}

  Object.keys(mpVoteLogByLthing).forEach((lthing) => {
    similarMpLookup[lthing] = {}
    differentMpLookup[lthing] = {}

    for (const mp of mps) {
      const voteLog = mpVoteLogByLthing[lthing][mp.id]
      if (voteLog === undefined) {
        continue
      }

      const votingIds = Object.keys(voteLog)

      const similar = {}
      const different = {}

      for (const otherMp of mps) {
        if (mp.id === otherMp.id) {
          continue
        }

        for (const votingId of votingIds) {
          const voteLogForOtherMp = mpVoteLogByLthing[lthing][otherMp.id]

          if (voteLogForOtherMp === undefined) {
            continue
          }

          const mpVote = voteLog[votingId]
          const otherMpVote = voteLogForOtherMp[votingId]

          const mpTookStand =
            mpVote === 'já' ||
            mpVote === 'nei' ||
            mpVote === 'greiðir ekki atkvæði'
          const otherMpTookStand =
            otherMpVote === 'já' ||
            otherMpVote === 'nei' ||
            otherMpVote === 'greiðir ekki atkvæði'

          const bothTookStand = mpTookStand && otherMpTookStand

          if (bothTookStand) {
            if (!similar[otherMp.id]) {
              similar[otherMp.id] = 0
            }

            if (!different[otherMp.id]) {
              different[otherMp.id] = 0
            }

            if (mpVote === otherMpVote) {
              similar[otherMp.id] += 1
            } else {
              different[otherMp.id] += 1
            }
          }
        }
      }

      similarMpLookup[lthing][mp.id] = similar
      differentMpLookup[lthing][mp.id] = different
    }
  })

  return { similarMpLookup, differentMpLookup }
}

export function createSortedMpVoteSimilarityLookup(
  lookup,
  mpLookup,
  mpVoteSummary,
  lthing = 'allt',
) {
  const mpIds = Object.keys(lookup)

  const mpToPartyId = getMpToPartyLookup()

  const result = {}
  mpIds
    .filter((mpId) => mpVoteSummary[mpId]) // only include MPs that have voted
    .forEach((mpId) => {
      const otherMpIds = Object.keys(lookup[mpId])
      const totalNumberOfStandsTaken =
        mpVoteSummary[mpId].voteSummary.numberOfStandsTaken
      const totalNumberOfIdleVotes =
        mpVoteSummary[mpId].voteSummary.numberOfIdleVotes
      const totalVotesWithStand =
        totalNumberOfStandsTaken + totalNumberOfIdleVotes

      result[mpId] = otherMpIds
        .sort((a, b) => {
          return lookup[mpId][b] - lookup[mpId][a]
        })
        .map((otherMpId) => {
          const votes = lookup[mpId][otherMpId]

          const similarity = votes / totalVotesWithStand
          let similarityPrecision = 0
          if (similarity < 0.5) {
            similarityPrecision = parseFloat((similarity * 100).toFixed(2))
          } else {
            similarityPrecision = parseFloat((similarity * 100).toFixed(1))
          }
          return {
            mp: {
              id: mpLookup[otherMpId].id,
              name: mpLookup[otherMpId].mpName,
              partyId: mpToPartyId[lthing][mpLookup[otherMpId].id],
            },
            votes,
            similarity: similarityPrecision,
          }
        })
    })

  return result
}

export function createTotalSimilarVoteLookup(lookup, lthings) {
  const totalLookup = {}
  for (const lthing of lthings) {
    // console.log('\tProcessing lthing', lthing)
    Object.keys(lookup[lthing]).forEach((mpId) => {
      if (totalLookup[mpId] === undefined) {
        totalLookup[mpId] = {}
      }

      Object.keys(lookup[lthing][mpId]).forEach((similarMpId) => {
        // console.log('\t\tProcessing similar MP', similarMpId)
        if (totalLookup[mpId][similarMpId] === undefined) {
          totalLookup[mpId][similarMpId] = 0
        }

        totalLookup[mpId][similarMpId] += lookup[lthing][mpId][similarMpId]
      })
    })
  }

  return totalLookup
}

function incrementWeekdayHourLookup(lookup, dayOfWeek, hourOfDay) {
  if (!lookup.statistics) {
    lookup.statistics = {
      max: 0,
      total: 0,
    }
  }

  if (!lookup.data) {
    lookup.data = {}
  }

  if (!lookup.data[dayOfWeek]) {
    lookup.data[dayOfWeek] = {}
  }

  if (!lookup.data[dayOfWeek][hourOfDay]) {
    lookup.data[dayOfWeek][hourOfDay] = 0
  }

  lookup.data[dayOfWeek][hourOfDay] += 1
  lookup.statistics.total += 1

  if (lookup.statistics.max < lookup.data[dayOfWeek][hourOfDay]) {
    lookup.statistics.max = lookup.data[dayOfWeek][hourOfDay]
  }
}

export function updateAbsentVoteTimeMatrixSummary(
  result,
  votings,
  votes,
  mpToPartyLookup,
) {
  const votingToDate = {}
  for (const voting of votings) {
    votingToDate[voting.id] = new Date(voting.date)
  }

  if (!result.total) {
    result.total = {}
  }

  if (!result.byMp) {
    result.byMp = {}
  }

  if (!result.byParty) {
    result.byParty = {}
  }

  for (const vote of votes) {
    const isAbsent = vote.vote === 'fjarverandi'

    if (!isAbsent) {
      continue
    }

    const date = votingToDate[vote.votingId]

    const dayOfWeek = date.getDay()
    const hourOfDay = date.getHours()

    incrementWeekdayHourLookup(result.total, dayOfWeek, hourOfDay)

    if (!result.byMp[vote.mpId]) {
      result.byMp[vote.mpId] = {}
    }

    incrementWeekdayHourLookup(result.byMp[vote.mpId], dayOfWeek, hourOfDay)

    if (!result.byParty[mpToPartyLookup[vote.mpId]]) {
      result.byParty[mpToPartyLookup[vote.mpId]] = {}
    }

    incrementWeekdayHourLookup(
      result.byParty[mpToPartyLookup[vote.mpId]],
      dayOfWeek,
      hourOfDay,
    )
  }
}
