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
            numberOfIdleVotes: 0,
          },
          voteTypes: {},
        }
      }

      mpSimilarVotes[mp.mpId] = {}

      mp.votes.forEach(voteTopic => {
        const topicId = `${term.lthing}-${voteTopic.id}`
        voteTopic.votes.forEach(vote => {
          const voteType = vote.vote

          reducedLookup[topicId].proposals[vote.proposalUrl][voteType].forEach(voterId => {
            if (voterId !== mp.mpId) {
              if (!mpSimilarVotes[mp.mpId][voterId]) {
                mpSimilarVotes[mp.mpId][voterId] = 0
              }

              mpSimilarVotes[mp.mpId][voterId] += 1
            }
          })

          mpVoteSummary[mp.mpId].voteSummary.numberOfVotes += 1
          if (!mpVoteSummary[mp.mpId].voteTypes[voteType]) {
            mpVoteSummary[mp.mpId].voteTypes[voteType] = 0
          }

          mpVoteSummary[mp.mpId].voteTypes[voteType] += 1
        })
      })
    })
  })

  // const voterParty = mpToPartyLookup[voterId]
  // if (voterParty !== currentMp.party) {
  //   if (!partySimilarVotes[currentMp.party][voterParty]) {
  //     partySimilarVotes[currentMp.party][voterParty] = 0
  //   }
  //   partySimilarVotes[currentMp.party][voterParty] += 1
  // }

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
      } else {
        summary.voteSummary.numberOfAway += numberOfVotesForType
      }
    })

    const numberOfVotes = summary.voteSummary.numberOfVotes
    const standsTaken = summary.voteSummary.numberOfStandsTaken / numberOfVotes
    const idle = summary.voteSummary.numberOfIdleVotes / numberOfVotes
    const away = summary.voteSummary.numberOfAway / numberOfVotes
    summary.votePercentages = {
      standsTaken: parseFloat((standsTaken * 100).toFixed(1)),
      idle: parseFloat((idle * 100).toFixed(1)),
      away: parseFloat((away * 100).toFixed(1)),
    }
  })

  writeToFile(mpVoteSummary, 'data/export/mp-vote-summaries.json', true)

  const sortedMpSimilarVotes = {}
  mps.forEach(mp => {
    const similarVoteLookup = mpSimilarVotes[mp.id]
    const similarVoterIds = Object.keys(similarVoteLookup)

    const totalNumberOfStandsTaken = mpVoteSummary[mp.id].voteSummary.numberOfStandsTaken
    const totalNumberOfIdleVotes = mpVoteSummary[mp.id].voteSummary.numberOfIdleVotes
    const totalVotesWithStand = totalNumberOfStandsTaken + totalNumberOfIdleVotes

    const sortedSimilarVoters = similarVoterIds.sort((a, b) => {
      const similarVotesByA = mpSimilarVotes[mp.id][a]
      const similarVotesByB = mpSimilarVotes[mp.id][b]

      return similarVotesByB - similarVotesByA
    }).map(voterId => {
      const similarity = mpSimilarVotes[mp.id][voterId] / totalVotesWithStand
      let similarityPrecision = 0
      if (similarity < 0.5) {
        similarityPrecision = parseFloat((similarity * 100).toFixed(2))
      } else {
        similarityPrecision = parseFloat((similarity * 100).toFixed(1))
      }
      return {
        mp: mpLookup[voterId],
        similarVotes: mpSimilarVotes[mp.id][voterId],
        similarity: similarityPrecision,
      }
    }).sort((a, b) => b.similarity - a.similarity)

    sortedMpSimilarVotes[mp.id] = sortedSimilarVoters
  })
  writeToFile(sortedMpSimilarVotes, 'data/export/mp-similar-votes.json', true)

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

  writeToFile(reducedLookup, 'data/term/lookup-temp.json', true)
}
