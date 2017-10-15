function getVoteKeyType(vote) {
  if (vote === 'já' || vote === 'nei') {
    return 'standsTaken'
  } else if (vote === 'greiðir ekki atkvæði') {
    return 'idle'
  }
  return 'away'
}

function generateSortedMpVotePositionsByLthing(mpPositionsByLthing) {
  const sortedMpPositionsByLthing = {}

  Object.keys(mpPositionsByLthing).forEach(lthing => {
    sortedMpPositionsByLthing[lthing] = {}

    Object.keys(mpPositionsByLthing[lthing]).forEach(mpId => {
      const caseIds = Object.keys(mpPositionsByLthing[lthing][mpId])
      sortedMpPositionsByLthing[lthing][mpId] = caseIds.map(caseId => {
        const currentCase = mpPositionsByLthing[lthing][mpId][caseId]

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
  })

  return sortedMpPositionsByLthing
}

export function generateMpVotePositionsByLthing(votings, caseClassificationLookup, sectionLookup) {
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

  return generateSortedMpVotePositionsByLthing(mpPositionsByLthing)
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
