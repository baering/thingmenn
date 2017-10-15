function getVoteKeyType(vote) {
  if (vote === 'já' || vote === 'nei') {
    return 'standsTaken'
  } else if (vote === 'greiðir ekki atkvæði') {
    return 'idle'
  }
  return 'away'
}

export function generateMpPositionsByLthing(votings, caseClassificationLookup, sectionLookup) {
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

  return mpPositionsByLthing
}

export function generateSortedMpPositionsByLthing(mpPositionsByLthing) {
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
