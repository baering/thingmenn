import {
  getMpToPartyLookup,
} from '../helpers'

import {
  documentIsOfInterest,
} from '../documents/helpers'

function getVoteKeyType(vote) {
  if (vote === 'já' || vote === 'nei') {
    return 'standsTaken'
  } else if (vote === 'greiðir ekki atkvæði') {
    return 'idle'
  }
  return 'away'
}

function generateSortedVotePositions(positions) {
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
  const sortedPositionsByLthing = {}

  Object.keys(positionsByLthing).forEach(lthing => {
    sortedPositionsByLthing[lthing] = generateSortedVotePositions(
      positionsByLthing[lthing],
    )
  })

  return sortedPositionsByLthing
}

function generateRawMpVotePositionsByLthing(
  votings,
  caseClassificationLookup,
  sectionLookup,
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

  return mpPositionsByLthing
}

export function generateMpVotePositions(
  votings,
  caseClassificationLookup,
  sectionLookup
) {
  const mpPositionsByLthing = generateRawMpVotePositionsByLthing(
    votings,
    caseClassificationLookup,
    sectionLookup,
  )

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

export function generatePartyVotePositions(
  votings,
  caseClassificationLookup,
  sectionLookup,
) {
  const partyPositionsByLthing = {}
  const partyPositionsTotal = {}

  const mpToPartyId = getMpToPartyLookup()

  const mpPositionsByLthing = generateRawMpVotePositionsByLthing(
    votings,
    caseClassificationLookup,
    sectionLookup,
  )

  Object.keys(mpPositionsByLthing).forEach(lthing => {
    partyPositionsByLthing[lthing] = {}
    Object.keys(mpPositionsByLthing[lthing]).forEach(mpId => {
      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partyPositionsByLthing[lthing][mpPartyId] === undefined) {
        partyPositionsByLthing[lthing][mpPartyId] = {}
      }

      if (partyPositionsTotal[mpPartyId] === undefined) {
        partyPositionsTotal[mpPartyId] = {}
      }

      Object.keys(mpPositionsByLthing[lthing][mpId]).forEach(sectionId => {
        if (partyPositionsByLthing[lthing][mpPartyId][sectionId] === undefined) {
          partyPositionsByLthing[lthing][mpPartyId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        if (partyPositionsTotal[mpPartyId][sectionId] === undefined) {
          partyPositionsTotal[mpPartyId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        Object.keys(mpPositionsByLthing[lthing][mpId][sectionId].voteSplit).forEach(voteType => {
          if (partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[voteType] === undefined) {
            partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[voteType] = 0
          }

          if (partyPositionsTotal[mpPartyId][sectionId].voteSplit[voteType] === undefined) {
            partyPositionsTotal[mpPartyId][sectionId].voteSplit[voteType] = 0
          }

          const value = mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteType]

          partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[voteType] += value
          partyPositionsTotal[mpPartyId][sectionId].voteSplit[voteType] += value
        })
      })
    })
  })

  return {
    partyVotePositionsByLthing: generateSortedVotePositionsByLthing(partyPositionsByLthing),
    partyVotePositionsTotal: generateSortedVotePositions(partyPositionsTotal),
  }
}

function generateSortedPositions(positions) {
  const sortedPositions = {}

  Object.keys(positions).forEach(id => {
    const sectionIds = Object.keys(positions[id])
    sortedPositions[id] = sectionIds.map(sectionId =>
      positions[id][sectionId]
    ).sort((a, b) => b.count - a.count)
  })

  return sortedPositions
}

function generateSortedPositionsByLthing(speechPositionsByLthing) {
  const sortedPositionsByLthing = {}

  Object.keys(speechPositionsByLthing).forEach(lthing => {
    sortedPositionsByLthing[lthing] = generateSortedPositions(
      speechPositionsByLthing[lthing]
    )
  })

  return sortedPositionsByLthing
}

export function generateMpSpeechPositions(
  speechClassificationsByLthing,
  caseClassificationLookup,
  sectionLookup
) {
  const mpPositionsByLthing = {}
  const mpPositionsTotal = {}

  Object.keys(speechClassificationsByLthing).forEach(lthing => {
    mpPositionsByLthing[lthing] = {}

    for (const speech of speechClassificationsByLthing[lthing]) {
      const { mp } = speech
      if (mpPositionsByLthing[lthing][mp.id] === undefined) {
        mpPositionsByLthing[lthing][mp.id] = {}
      }

      if (mpPositionsTotal[mp.id] === undefined) {
        mpPositionsTotal[mp.id] = {}
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
            count: 0,
          }
        }

        if (mpPositionsTotal[mp.id][sectionId] === undefined) {
          mpPositionsTotal[mp.id][sectionId] = {
            name: sectionName,
            count: 0,
          }
        }

        mpPositionsByLthing[lthing][mp.id][sectionId].count += 1
        mpPositionsTotal[mp.id][sectionId].count += 1
      })
    }
  })

  return {
    mpSpeechPositionsByLthing: generateSortedPositionsByLthing(mpPositionsByLthing),
    mpSpeechPositionsTotal: generateSortedPositions(mpPositionsTotal),
  }
}

export function generatePartyPositions(mpSpeechPositionsByLthing) {
  const partyPositionsByLthing = {}
  const partyPositionsTotal = {}

  const mpToPartyId = getMpToPartyLookup()

  Object.keys(mpSpeechPositionsByLthing).forEach(lthing => {
    partyPositionsByLthing[lthing] = {}

    Object.keys(mpSpeechPositionsByLthing[lthing]).forEach(mpId => {
      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partyPositionsByLthing[lthing][mpPartyId] === undefined) {
        partyPositionsByLthing[lthing][mpPartyId] = {}
      }

      if (partyPositionsTotal[mpPartyId] === undefined) {
        partyPositionsTotal[mpPartyId] = {}
      }

      mpSpeechPositionsByLthing[lthing][mpId].forEach(({ name, count }) => {
        if (partyPositionsByLthing[lthing][mpPartyId][name] === undefined) {
          partyPositionsByLthing[lthing][mpPartyId][name] = {
            name,
            count: 0,
          }
        }

        if (partyPositionsTotal[mpPartyId][name] === undefined) {
          partyPositionsTotal[mpPartyId][name] = {
            name,
            count: 0,
          }
        }

        partyPositionsByLthing[lthing][mpPartyId][name].count += count
        partyPositionsTotal[mpPartyId][name].count += count
      })
    })
  })

  return {
    byLthing: generateSortedPositionsByLthing(partyPositionsByLthing),
    total: generateSortedPositions(partyPositionsTotal),
  }
}

function findOriginalDocument(doc, lthing, documentLookup, numberOfCalls = 0) {
  if (numberOfCalls > 50) {
    console.log('findOriginalDocument tried to exceed allowed call stack size')
    return null
  }

  if (doc.id === doc.caseId) {
    return doc
  }
  return findOriginalDocument(
    documentLookup[lthing][doc.caseId],
    lthing,
    documentLookup,
    numberOfCalls + 1
  )
}

export function generateMpDocumentPositions(
  documents,
  caseClassificationLookup,
  sectionLookup
) {
  const mpPositionsByLthing = {}
  const mpPositionsTotal = {}

  const documentIgnoreOptions = {
    ignoreInquiries: true,
  }

  let failCount = 0
  let totalCount = 0

  const documentLookup = {}
  Object.keys(documents).forEach(lthing => {
    documentLookup[lthing] = {}
    documents[lthing].forEach(doc => {
      documentLookup[lthing][doc.id] = doc
    })
  })

  Object.keys(documents).forEach(lthing => {
    mpPositionsByLthing[lthing] = {}

    for (const doc of documents[lthing]) {
      let documentToUse = doc
      if (!documentIsOfInterest(documentToUse, documentIgnoreOptions)) {
        continue
      }

      totalCount += 1

      let caseClassifications = caseClassificationLookup[lthing][documentToUse.caseId]
      if (caseClassifications === undefined) {
        const correctDoc = findOriginalDocument(doc, lthing, documentLookup)

        if (correctDoc === null) {
          continue
        }

        if (!documentIsOfInterest(correctDoc, documentIgnoreOptions)) {
          continue
        }

        documentToUse = correctDoc
        caseClassifications = caseClassificationLookup[lthing][correctDoc.id]

        if (caseClassifications === undefined) {
          failCount += 1
          continue
        }
      }

      documentToUse.presenters.forEach(presenter => {
        if (mpPositionsByLthing[lthing][presenter.id] === undefined) {
          mpPositionsByLthing[lthing][presenter.id] = {}
        }

        if (mpPositionsTotal[presenter.id] === undefined) {
          mpPositionsTotal[presenter.id] = {}
        }

        caseClassifications.sectionIds.forEach(sectionId => {
          const sectionName = sectionLookup[sectionId].name
          if (mpPositionsByLthing[lthing][presenter.id][sectionId] === undefined) {
            mpPositionsByLthing[lthing][presenter.id][sectionId] = {
              name: sectionName,
              count: 0,
            }
          }

          if (mpPositionsTotal[presenter.id][sectionId] === undefined) {
            mpPositionsTotal[presenter.id][sectionId] = {
              name: sectionName,
              count: 0,
            }
          }

          mpPositionsByLthing[lthing][presenter.id][sectionId].count += 1
          mpPositionsTotal[presenter.id][sectionId].count += 1
        })
      })
    }
  })

  console.log('Failed classifications: ', failCount, 'out of', totalCount)

  return {
    mpDocumentPositionsByLthing: generateSortedPositionsByLthing(mpPositionsByLthing),
    mpDocumentPositionsTotal: generateSortedPositions(mpPositionsTotal),
  }
}
