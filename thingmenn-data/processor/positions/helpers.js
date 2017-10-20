import {
  getMpToPartyLookup,
} from '../helpers'

function getVoteKeyType(vote) {
  if (vote === 'já' || vote === 'nei') {
    return 'standsTaken'
  } else if (vote === 'greiðir ekki atkvæði') {
    return 'idle'
  }
  return 'away'
}

function generateSortedVotePositions(positions) {
  console.log('generating sorted positions')
  const sortedVotePositions = {}
  Object.keys(positions).forEach(id => {
    const caseIds = Object.keys(positions[id])
    sortedVotePositions[id] = caseIds.map(caseId => {
      const currentCase = positions[id][caseId]

      const voteTypes = Object.keys(currentCase.voteSplit)
      let totalVotes = 0

      voteTypes.forEach(voteType => {
        totalVotes += currentCase.voteSplit[voteType]
      })

      voteTypes.forEach(voteType => {
        const votesForType = currentCase.voteSplit[voteType]
        const occurance = votesForType / totalVotes
        currentCase.voteSplit[voteType] = {
          occurance: votesForType,
          percentage: parseFloat((occurance * 100).toFixed(2)),
        }
      })

      return {
        name: currentCase.name,
        voteSplit: currentCase.voteSplit,
      }
    }).sort((a, b) => {
      const aStandsTaken = a.voteSplit.standsTaken
      const bStandsTaken = b.voteSplit.standsTaken

      if (aStandsTaken && bStandsTaken) {
        return bStandsTaken.percentage - aStandsTaken.percentage
      } else if (aStandsTaken && !bStandsTaken) {
        return -1
      } else if (!aStandsTaken && bStandsTaken) {
        return 1
      }
      return 0
    })
  })

  return sortedVotePositions
}

function generateSortedVotePositionsByLthing(positionsByLthing) {
  console.log('generating sorted positions by lthing')
  const sortedPositionsByLthing = {}

  Object.keys(positionsByLthing).forEach(lthing => {
    sortedPositionsByLthing[lthing] = generateSortedVotePositions(
      positionsByLthing[lthing],
    )
  })

  return sortedPositionsByLthing
}

export function generateMpVotePositions(
  votings,
  caseClassificationLookup,
  sectionLookup
) {
  const mpPositionsByLthing = {}

  Object.keys(votings).forEach(lthing => {
    const votesForLthing = votings[lthing].votes

    votesForLthing.forEach(voteInfo => {
      const { vote, mpId, caseId } = voteInfo

      if (mpPositionsByLthing[lthing] === undefined) {
        mpPositionsByLthing[lthing] = {}
      }

      if (mpPositionsByLthing[lthing][mpId] === undefined) {
        mpPositionsByLthing[lthing][mpId] = {}
      }

      const voteKeyType = getVoteKeyType(vote)
      const caseClassifications = caseClassificationLookup[lthing][caseId]

      caseClassifications.sectionIds.forEach(sectionId => {
        const sectionName = sectionLookup[sectionId].name
        if (mpPositionsByLthing[lthing][mpId][sectionId] === undefined) {
          mpPositionsByLthing[lthing][mpId][sectionId] = {
            name: sectionName,
            voteSplit: {},
          }
        }

        if (mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteKeyType] === undefined) {
          mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteKeyType] = 0
        }

        mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteKeyType] += 1
      })
    })
  })

  // const mpToPartyLookup = getMpToPartyLookup()
  const mpPositionsTotal = {}

  Object.keys(mpPositionsByLthing).forEach(lthing => {
    Object.keys(mpPositionsByLthing[lthing]).forEach(mpId => {
      if (mpPositionsTotal[mpId] === undefined) {
        mpPositionsTotal[mpId] = {}
      }
      Object.keys(mpPositionsByLthing[lthing][mpId]).forEach(sectionId => {
        if (mpPositionsTotal[mpId][sectionId] === undefined) {
          mpPositionsTotal[mpId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        Object.keys(mpPositionsByLthing[lthing][mpId][sectionId].voteSplit).forEach(voteType => {
          if (mpPositionsTotal[mpId][sectionId].voteSplit[voteType] === undefined) {
            mpPositionsTotal[mpId][sectionId].voteSplit[voteType] = 0
          }

          const value = mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteType]
          mpPositionsTotal[mpId][sectionId].voteSplit[voteType] += value
        })
      })
    })
  })

  return {
    mpVotePositionsByLthing: generateSortedVotePositionsByLthing(mpPositionsByLthing),
    mpVotePositionsTotal: generateSortedVotePositions(mpPositionsTotal),
  }
}

export function generatePartyVotePositions(mpPositionsByLthing) {
  const partyVotePositionsByLthing = {}
  const partyVotePositionsTotal = {}

  Object.keys(mpPositionsByLthing).forEach(lthing => {
    partyVotePositionsByLthing[lthing] = {}

    mpPositionsByLthing[lthing].forEach(votePositions => {

    })
  })
}

function generateSortedMpSpeechPositionsByLthing(mpSpeechPositionsByLthing) {
  const sortedMpPositionsByLthing = {}

  Object.keys(mpSpeechPositionsByLthing).forEach(lthing => {
    sortedMpPositionsByLthing[lthing] = {}

    Object.keys(mpSpeechPositionsByLthing[lthing]).forEach(mpId => {
      const sectionIds = Object.keys(mpSpeechPositionsByLthing[lthing][mpId])
      sortedMpPositionsByLthing[lthing][mpId] = sectionIds.map(sectionId =>
        mpSpeechPositionsByLthing[lthing][mpId][sectionId]
      ).sort((a, b) => b.speechCount - a.speechCount)
    })
  })

  return sortedMpPositionsByLthing
}

export function generateMpSpeechPositionsByLthing(
  speechClassificationsByLthing,
  caseClassificationLookup,
  sectionLookup
) {
  const mpPositionsByLthing = {}

  Object.keys(speechClassificationsByLthing).forEach(lthing => {
    mpPositionsByLthing[lthing] = {}

    for (const speech of speechClassificationsByLthing[lthing]) {
      const { mp } = speech
      if (mpPositionsByLthing[lthing][mp.id] === undefined) {
        mpPositionsByLthing[lthing][mp.id] = {}
      }

      const currentCase = speech.case
      const caseClassifications = caseClassificationLookup[lthing][currentCase.id]

      if (caseClassifications === undefined) {
        continue
      }

      caseClassifications.sectionIds.forEach(sectionId => {
        const sectionName = sectionLookup[sectionId].name
        if (mpPositionsByLthing[lthing][mp.id][sectionId] === undefined) {
          mpPositionsByLthing[lthing][mp.id][sectionId] = {
            name: sectionName,
            speechCount: 0,
          }
        }

        mpPositionsByLthing[lthing][mp.id][sectionId].speechCount += 1
      })
    }
  })

  return generateSortedMpSpeechPositionsByLthing(mpPositionsByLthing)
}
