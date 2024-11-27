import { getMpToPartyLookup } from '../helpers'

import { documentIsOfInterest } from '../documents/helpers'
import { lthingToTerm } from '../../utility/lthing'

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
  Object.keys(positions).forEach((id) => {
    const caseIds = Object.keys(positions[id])
    sortedVotePositions[id] = caseIds
      .map((caseId) => {
        const currentCase = positions[id][caseId]

        const voteTypes = Object.keys(currentCase.voteSplit)
        let totalVotes = 0

        voteTypes.forEach((voteType) => {
          totalVotes += currentCase.voteSplit[voteType]
        })

        voteTypes.forEach((voteType) => {
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
      })
      .sort((a, b) => {
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

  Object.keys(positionsByLthing).forEach((lthing) => {
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

  Object.keys(votings).forEach((lthing) => {
    const votesForLthing = votings[lthing].votes

    votesForLthing.forEach((voteInfo) => {
      const { vote, mpId, caseId } = voteInfo

      if (mpPositionsByLthing[lthing] === undefined) {
        mpPositionsByLthing[lthing] = {}
      }

      if (mpPositionsByLthing[lthing][mpId] === undefined) {
        mpPositionsByLthing[lthing][mpId] = {}
      }

      const voteKeyType = getVoteKeyType(vote)
      const caseClassifications = caseClassificationLookup[lthing][caseId]

      caseClassifications.sectionIds.forEach((sectionId) => {
        const sectionName = sectionLookup[sectionId].name
        if (mpPositionsByLthing[lthing][mpId][sectionId] === undefined) {
          mpPositionsByLthing[lthing][mpId][sectionId] = {
            name: sectionName,
            voteSplit: {},
          }
        }

        if (
          mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[
            voteKeyType
          ] === undefined
        ) {
          mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[
            voteKeyType
          ] = 0
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
  sectionLookup,
) {
  const mpPositionsByLthing = generateRawMpVotePositionsByLthing(
    votings,
    caseClassificationLookup,
    sectionLookup,
  )

  const mpPositionsTotalByTerm = {}

  Object.keys(mpPositionsByLthing).forEach((lthing) => {
    const term = lthingToTerm(lthing)

    if (mpPositionsTotalByTerm[term.id] === undefined) {
      mpPositionsTotalByTerm[term.id] = {}
    }

    const mpPositionsTotalForTerm = mpPositionsTotalByTerm[term.id]

    Object.keys(mpPositionsByLthing[lthing]).forEach((mpId) => {
      if (mpPositionsTotalForTerm[mpId] === undefined) {
        mpPositionsTotalForTerm[mpId] = {}
      }
      Object.keys(mpPositionsByLthing[lthing][mpId]).forEach((sectionId) => {
        if (mpPositionsTotalForTerm[mpId][sectionId] === undefined) {
          mpPositionsTotalForTerm[mpId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        Object.keys(
          mpPositionsByLthing[lthing][mpId][sectionId].voteSplit,
        ).forEach((voteType) => {
          if (
            mpPositionsTotalForTerm[mpId][sectionId].voteSplit[voteType] ===
            undefined
          ) {
            mpPositionsTotalForTerm[mpId][sectionId].voteSplit[voteType] = 0
          }

          const value =
            mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteType]
          mpPositionsTotalForTerm[mpId][sectionId].voteSplit[voteType] += value
        })
      })
    })
  })

  return {
    mpVotePositionsByLthing:
      generateSortedVotePositionsByLthing(mpPositionsByLthing),
    mpVotePositionsTotal: Object.keys(mpPositionsTotalByTerm).reduce(
      (result, termId) => {
        result[termId] = generateSortedVotePositions(
          mpPositionsTotalByTerm[termId],
        )
        return result
      },
      {},
    ),
  }
}

export function generatePartyVotePositions(
  votings,
  caseClassificationLookup,
  sectionLookup,
) {
  const partyPositionsByLthing = {}
  const partyPositionsTotalByTerm = {}

  const mpToPartyId = getMpToPartyLookup()

  const mpPositionsByLthing = generateRawMpVotePositionsByLthing(
    votings,
    caseClassificationLookup,
    sectionLookup,
  )

  Object.keys(mpPositionsByLthing).forEach((lthing) => {
    const term = lthingToTerm(lthing)

    if (partyPositionsTotalByTerm[term.id] === undefined) {
      partyPositionsTotalByTerm[term.id] = {}
    }

    const partyPositionsTotalForTerm = partyPositionsTotalByTerm[term.id]

    partyPositionsByLthing[lthing] = {}
    Object.keys(mpPositionsByLthing[lthing]).forEach((mpId) => {
      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partyPositionsByLthing[lthing][mpPartyId] === undefined) {
        partyPositionsByLthing[lthing][mpPartyId] = {}
      }

      if (partyPositionsTotalForTerm[mpPartyId] === undefined) {
        partyPositionsTotalForTerm[mpPartyId] = {}
      }

      Object.keys(mpPositionsByLthing[lthing][mpId]).forEach((sectionId) => {
        if (
          partyPositionsByLthing[lthing][mpPartyId][sectionId] === undefined
        ) {
          partyPositionsByLthing[lthing][mpPartyId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        if (partyPositionsTotalForTerm[mpPartyId][sectionId] === undefined) {
          partyPositionsTotalForTerm[mpPartyId][sectionId] = {
            name: sectionLookup[sectionId].name,
            voteSplit: {},
          }
        }

        Object.keys(
          mpPositionsByLthing[lthing][mpId][sectionId].voteSplit,
        ).forEach((voteType) => {
          if (
            partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[
              voteType
            ] === undefined
          ) {
            partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[
              voteType
            ] = 0
          }

          if (
            partyPositionsTotalForTerm[mpPartyId][sectionId].voteSplit[
              voteType
            ] === undefined
          ) {
            partyPositionsTotalForTerm[mpPartyId][sectionId].voteSplit[
              voteType
            ] = 0
          }

          const value =
            mpPositionsByLthing[lthing][mpId][sectionId].voteSplit[voteType]

          partyPositionsByLthing[lthing][mpPartyId][sectionId].voteSplit[
            voteType
          ] += value
          partyPositionsTotalForTerm[mpPartyId][sectionId].voteSplit[
            voteType
          ] += value
        })
      })
    })
  })

  return {
    partyVotePositionsByLthing: generateSortedVotePositionsByLthing(
      partyPositionsByLthing,
    ),
    partyVotePositionsTotal: Object.keys(partyPositionsTotalByTerm).reduce(
      (result, termId) => {
        result[termId] = generateSortedVotePositions(
          partyPositionsTotalByTerm[termId],
        )
        return result
      },
      {},
    ),
  }
}

function generateSortedPositions(positions) {
  const sortedPositions = {}

  Object.keys(positions).forEach((id) => {
    const sectionIds = Object.keys(positions[id])
    sortedPositions[id] = sectionIds
      .map((sectionId) => positions[id][sectionId])
      .sort((a, b) => b.count - a.count)
  })

  return sortedPositions
}

function generateSortedPositionsByLthing(speechPositionsByLthing) {
  const sortedPositionsByLthing = {}

  Object.keys(speechPositionsByLthing).forEach((lthing) => {
    sortedPositionsByLthing[lthing] = generateSortedPositions(
      speechPositionsByLthing[lthing],
    )
  })

  return sortedPositionsByLthing
}

export function generateMpSpeechPositions(
  speechClassificationsByLthing,
  caseClassificationLookup,
  sectionLookup,
) {
  const mpPositionsByLthing = {}
  const mpPositionsTotalByTerm = {}

  Object.keys(speechClassificationsByLthing).forEach((lthing) => {
    mpPositionsByLthing[lthing] = {}

    const term = lthingToTerm(lthing)

    if (mpPositionsTotalByTerm[term.id] === undefined) {
      mpPositionsTotalByTerm[term.id] = {}
    }

    const mpPositionsTotalForTerm = mpPositionsTotalByTerm[term.id]

    for (const speech of speechClassificationsByLthing[lthing]) {
      const { mp } = speech
      if (mpPositionsByLthing[lthing][mp.id] === undefined) {
        mpPositionsByLthing[lthing][mp.id] = {}
      }

      if (mpPositionsTotalForTerm[mp.id] === undefined) {
        mpPositionsTotalForTerm[mp.id] = {}
      }

      const currentCase = speech.case
      const caseClassifications =
        caseClassificationLookup[lthing][currentCase.id]

      if (caseClassifications === undefined) {
        continue
      }

      caseClassifications.sectionIds.forEach((sectionId) => {
        const sectionName = sectionLookup[sectionId].name
        if (mpPositionsByLthing[lthing][mp.id][sectionId] === undefined) {
          mpPositionsByLthing[lthing][mp.id][sectionId] = {
            name: sectionName,
            count: 0,
          }
        }

        if (mpPositionsTotalForTerm[mp.id][sectionId] === undefined) {
          mpPositionsTotalForTerm[mp.id][sectionId] = {
            name: sectionName,
            count: 0,
          }
        }

        mpPositionsByLthing[lthing][mp.id][sectionId].count += 1
        mpPositionsTotalForTerm[mp.id][sectionId].count += 1
      })
    }
  })

  return {
    mpSpeechPositionsByLthing:
      generateSortedPositionsByLthing(mpPositionsByLthing),
    mpSpeechPositionsTotal: Object.keys(mpPositionsTotalByTerm).reduce(
      (result, termId) => {
        result[termId] = generateSortedPositions(mpPositionsTotalByTerm[termId])
        return result
      },
      {},
    ),
  }
}

export function generatePartyPositions(mpSpeechPositionsByLthing) {
  const partyPositionsByLthing = {}
  const partyPositionsTotalByTerm = {}

  const mpToPartyId = getMpToPartyLookup()

  Object.keys(mpSpeechPositionsByLthing).forEach((lthing) => {
    partyPositionsByLthing[lthing] = {}

    const term = lthingToTerm(lthing)

    if (partyPositionsTotalByTerm[term.id] === undefined) {
      partyPositionsTotalByTerm[term.id] = {}
    }

    const partyPositionsTotalForTerm = partyPositionsTotalByTerm[term.id]

    Object.keys(mpSpeechPositionsByLthing[lthing]).forEach((mpId) => {
      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partyPositionsByLthing[lthing][mpPartyId] === undefined) {
        partyPositionsByLthing[lthing][mpPartyId] = {}
      }

      if (partyPositionsTotalForTerm[mpPartyId] === undefined) {
        partyPositionsTotalForTerm[mpPartyId] = {}
      }

      mpSpeechPositionsByLthing[lthing][mpId].forEach(({ name, count }) => {
        if (partyPositionsByLthing[lthing][mpPartyId][name] === undefined) {
          partyPositionsByLthing[lthing][mpPartyId][name] = {
            name,
            count: 0,
          }
        }

        if (partyPositionsTotalForTerm[mpPartyId][name] === undefined) {
          partyPositionsTotalForTerm[mpPartyId][name] = {
            name,
            count: 0,
          }
        }

        partyPositionsByLthing[lthing][mpPartyId][name].count += count
        partyPositionsTotalForTerm[mpPartyId][name].count += count
      })
    })
  })

  return {
    byLthing: generateSortedPositionsByLthing(partyPositionsByLthing),
    total: Object.keys(partyPositionsTotalByTerm).reduce((result, termId) => {
      result[termId] = generateSortedPositions(
        partyPositionsTotalByTerm[termId],
      )
      return result
    }, {}),
  }
}

function findOriginalDocument(doc, lthing, documentLookup, numberOfCalls = 0) {
  if (numberOfCalls > 80) {
    console.log('findOriginalDocument tried to exceed allowed call stack size')
    return null
  }

  if (doc === undefined) {
    return null
  }

  if (doc.id === doc.caseId) {
    return doc
  }

  let nextLevel = null
  try {
    nextLevel = documentLookup[lthing][doc.caseId]
  } catch (e) {
    return nextLevel
  }

  return findOriginalDocument(
    nextLevel,
    lthing,
    documentLookup,
    numberOfCalls + 1,
  )
}

export function generateMpDocumentPositions(
  documents,
  caseClassificationLookup,
  sectionLookup,
) {
  const mpPositionsByLthing = {}
  const mpPositionsTotalByTerm = {}

  const documentIgnoreOptions = {
    ignoreInquiries: true,
  }

  let failCount = 0
  let totalCount = 0

  const documentLookup = {}
  Object.keys(documents).forEach((lthing) => {
    documentLookup[lthing] = {}
    documents[lthing].forEach((doc) => {
      documentLookup[lthing][doc.id] = doc
    })
  })

  Object.keys(documents).forEach((lthing) => {
    mpPositionsByLthing[lthing] = {}

    const term = lthingToTerm(lthing)

    if (mpPositionsTotalByTerm[term.id] === undefined) {
      mpPositionsTotalByTerm[term.id] = {}
    }

    const mpPositionsTotalForTerm = mpPositionsTotalByTerm[term.id]

    for (const doc of documents[lthing]) {
      let documentToUse = doc
      if (!documentIsOfInterest(documentToUse, documentIgnoreOptions)) {
        continue
      }

      totalCount += 1

      let caseClassifications =
        caseClassificationLookup[lthing][documentToUse.caseId]
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

      documentToUse.presenters.forEach((presenter) => {
        if (mpPositionsByLthing[lthing][presenter.id] === undefined) {
          mpPositionsByLthing[lthing][presenter.id] = {}
        }

        if (mpPositionsTotalForTerm[presenter.id] === undefined) {
          mpPositionsTotalForTerm[presenter.id] = {}
        }

        caseClassifications.sectionIds.forEach((sectionId) => {
          const sectionName = sectionLookup[sectionId].name
          if (
            mpPositionsByLthing[lthing][presenter.id][sectionId] === undefined
          ) {
            mpPositionsByLthing[lthing][presenter.id][sectionId] = {
              name: sectionName,
              count: 0,
            }
          }

          if (mpPositionsTotalForTerm[presenter.id][sectionId] === undefined) {
            mpPositionsTotalForTerm[presenter.id][sectionId] = {
              name: sectionName,
              count: 0,
            }
          }

          mpPositionsByLthing[lthing][presenter.id][sectionId].count += 1
          mpPositionsTotalForTerm[presenter.id][sectionId].count += 1
        })
      })
    }
  })

  console.log('Failed classifications: ', failCount, 'out of', totalCount)

  return {
    mpDocumentPositionsByLthing:
      generateSortedPositionsByLthing(mpPositionsByLthing),
    mpDocumentPositionsTotal: Object.keys(mpPositionsTotalByTerm).reduce(
      (result, termId) => {
        result[termId] = generateSortedPositions(mpPositionsTotalByTerm[termId])
        return result
      },
      {},
    ),
  }
}
