import { loadFile, writeToFile } from '../../utility/file'

function createLookup(allVotesForTerm) {
  const reducedLookup = {}
  allVotesForTerm.forEach(term => {
    term.votes.forEach(mp => {
      mp.votes.forEach(voteTopic => {
        const topicId = `${term.lthing}-${voteTopic.id}`

        if (!reducedLookup[topicId]) {
          reducedLookup[topicId] = {
            proposals: {},
          }
        }

        voteTopic.votes.forEach(vote => {
          if (!reducedLookup[topicId].proposals[vote.proposalUrl]) {
            reducedLookup[topicId].proposals[vote.proposalUrl] = {}
          }

          const voteType = vote.vote

          if (!reducedLookup[topicId].proposals[vote.proposalUrl][voteType]) {
            reducedLookup[topicId].proposals[vote.proposalUrl][voteType] = []
          }

          reducedLookup[topicId].proposals[vote.proposalUrl][voteType].push(mp.mpId)
        })
      })
    })
  })

  return reducedLookup
}

function createSortedMpVoteSimilarityLookup(lookup, mpLookup, mpVoteSummary) {
  const mpIds = Object.keys(lookup)

  const result = {}
  mpIds.forEach(mpId => {
    const otherMpIds = Object.keys(lookup[mpId])
    const totalNumberOfStandsTaken = mpVoteSummary[mpId].voteSummary.numberOfStandsTaken
    const totalNumberOfIdleVotes = mpVoteSummary[mpId].voteSummary.numberOfIdleVotes
    const totalVotesWithStand = totalNumberOfStandsTaken + totalNumberOfIdleVotes

    result[mpId] = otherMpIds.sort((a, b) => {
      return lookup[mpId][b] - lookup[mpId][a]
    }).map(otherMpId => {
      const votes = lookup[mpId][otherMpId]

      const similarity = votes / totalVotesWithStand
      let similarityPrecision = 0
      if (similarity < 0.5) {
        similarityPrecision = parseFloat((similarity * 100).toFixed(2))
      } else {
        similarityPrecision = parseFloat((similarity * 100).toFixed(1))
      }
      return {
        mp: mpLookup[otherMpId],
        votes,
        similarity: similarityPrecision,
      }
    })
  })

  return result
}

export default function createVoteSummary() {
  const mps = loadFile('data/export/mps.json')
  const mpToPartyLookup = {}
  const mpLookup = {}
  mps.forEach(mp => {
    mpToPartyLookup[mp.id] = mp.party
    mpLookup[mp.id] = mp
  })
  const allVotesForTerm = loadFile('data/all-votes-for-term.json')

  const reducedLookup = createLookup(allVotesForTerm)

  const mpVoteSummary = {}
  const mpSimilarVotes = {}
  const partySimilarVotes = {}

  const mpVoteLog = {}

  allVotesForTerm.forEach(term => {
    console.log(`Term: ${term.lthing}`)
    term.votes.forEach(mp => {
      if (!mpVoteSummary[mp.mpId]) {
        mpVoteSummary[mp.mpId] = {
          id: mp.mpId,
          name: mp.mpName,
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

      mpSimilarVotes[mp.mpId] = {}

      if (!mpVoteLog[mp.mpId]) {
        mpVoteLog[mp.mpId] = {}
      }

      mp.votes.forEach(voteTopic => {

        voteTopic.votes.forEach(vote => {
          const voteType = vote.vote

          const propsalId = vote.proposalUrl.replace('/thingstorf/thingmalin/atkvaedagreidsla/?nnafnak=', '')
          const voteIdentifier = `${term.lthing}-${propsalId}`

          mpVoteLog[mp.mpId][voteIdentifier] = voteType

          mpVoteSummary[mp.mpId].voteSummary.numberOfVotes += 1
          if (!mpVoteSummary[mp.mpId].voteTypes[voteType]) {
            mpVoteSummary[mp.mpId].voteTypes[voteType] = 0
          }

          mpVoteSummary[mp.mpId].voteTypes[voteType] += 1
        })
      })
    })
  })

  let partyCounters = {}
  const topics = Object.keys(reducedLookup)
  topics.forEach(topicId => {
    const proposalsForTopic = Object.keys(reducedLookup[topicId].proposals)
    proposalsForTopic.forEach(proposalUrl => {
      const voteTypes = Object.keys(reducedLookup[topicId].proposals[proposalUrl])
      voteTypes.forEach(voteType => {
        if (voteType === 'já' || voteType === 'nei' || voteType === 'greiðir ekki atkvæði') {
          const mpIds = reducedLookup[topicId].proposals[proposalUrl][voteType]

          const partyVoteSplit = {}
          mpIds.forEach(mpId => {
            const currentMp = mpLookup[mpId]

            if (!partyCounters[currentMp.party]) {
              partyCounters[currentMp.party] = {}
            }
            const currentLocationId = `${topicId}-${proposalUrl}-${voteType}`
            if (!partyCounters[currentMp.party][currentLocationId]) {
              partyCounters[currentMp.party][currentLocationId] = true
            }

            if (!partyVoteSplit[currentMp.party]) {
              partyVoteSplit[currentMp.party] = 0
            }
            partyVoteSplit[currentMp.party] += 1
          })

          const partyNames = Object.keys(partyVoteSplit)
          partyNames.forEach(currentParty => {
            if (!partySimilarVotes[currentParty]) {
              partySimilarVotes[currentParty] = {}
            }
            partyNames.forEach(partyName => {
              if (currentParty !== partyName) {
                if (!partySimilarVotes[currentParty][partyName]) {
                  partySimilarVotes[currentParty][partyName] = 0
                }
                // partySimilarVotes[currentParty][partyName] += partyVoteSplit[partyName]
                partySimilarVotes[currentParty][partyName] += 1
              }
            })
          })
        }
      })
    })
  })

  const mpIds = Object.keys(mpVoteSummary)
  mpIds.forEach(mpId => {
    const summary = mpVoteSummary[mpId]
    const voteTypes = Object.keys(summary.voteTypes)
    voteTypes.forEach(voteType => {
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
  })

  writeToFile(mpVoteSummary, 'data/export/mp-vote-summaries.json', true)

  const sortedPartySimilarVotes = {}
  const partyNames = Object.keys(partySimilarVotes)
  partyNames.forEach(partyName => {
    const similarParties = Object.keys(partySimilarVotes[partyName])
    const uniquePartyVotes = Object.keys(partyCounters[partyName]).length
    sortedPartySimilarVotes[partyName] = similarParties.sort((a, b) => {
      return partySimilarVotes[partyName][b] - partySimilarVotes[partyName][a]
    }).map(similarParty => {
      return {
        party: similarParty,
        similarVotes: partySimilarVotes[partyName][similarParty],
        totalVotes: uniquePartyVotes,
        similarity: partySimilarVotes[partyName][similarParty] / uniquePartyVotes,
      }
    }).sort((a, b) => b.similarity - a.similarity)
  })

  writeToFile(sortedPartySimilarVotes, 'data/export/party-similar-votes.json', true)

  const similarMpLookup = {}
  const differentMpLookup = {}

  mps.forEach(mp => {
    const voteLog = mpVoteLog[mp.id]
    const voteIdentifiers = Object.keys(voteLog)

    const similar = {}
    const different = {}

    mps.forEach(otherMp => {
      if (mp.id !== otherMp.id) {
        voteIdentifiers.forEach(voteIdentifier => {
          const voteLogForOtherMp = mpVoteLog[otherMp.id]

          const mpVote = voteLog[voteIdentifier]
          const otherMpVote = voteLogForOtherMp[voteIdentifier]

          const mpTookStand = (
            (mpVote === 'já') ||
            (mpVote === 'nei') ||
            (mpVote === 'greiðir ekki atkvæði')
          )
          const otherMpTookStand = (
            (otherMpVote === 'já') ||
            (otherMpVote === 'nei') ||
            (otherMpVote === 'greiðir ekki atkvæði')
          )

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
        })
      }
    })

    similarMpLookup[mp.id] = similar
    differentMpLookup[mp.id] = different
  })

  const sortedSimilarMpLookup = createSortedMpVoteSimilarityLookup(
    similarMpLookup,
    mpLookup,
    mpVoteSummary,
  )

  const sortedDifferentMpLookup = createSortedMpVoteSimilarityLookup(
    differentMpLookup,
    mpLookup,
    mpVoteSummary
  )

  writeToFile(sortedSimilarMpLookup, 'data/export/mp-similar-votes.json', true)
  writeToFile(sortedDifferentMpLookup, 'data/export/mp-different-votes.json', true)

  writeToFile(reducedLookup, 'data/term/lookup-temp.json', true)
}
