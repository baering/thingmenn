import { loadFile, writeToFile } from '../utility/file'
import { getTermFromId } from '../utility/lthing'
import { EXPORT_PATH } from './constants'

const getMpPartyIdForLthing = (mp, lthing) => {
  const lthingInfo = mp.lthings.find(
    (lthingInfo) => Number(lthingInfo.lthing) === Number(lthing),
  )

  if (!lthingInfo) {
    return null
  }

  return lthingInfo.partyId
}

const getMpPartyId = (mp, periodId) => {
  if (periodId.indexOf('-') !== -1) {
    // It's a term id
    const term = getTermFromId(periodId)

    if (!term) {
      return null
    }

    const mpsLthings = mp.lthings

    // get the most recent party
    for (const { lthing, partyId } of mpsLthings) {
      if (term.lthings.includes(lthing.toString())) {
        return partyId
      }
    }
  }

  // It's a lthing
  return getMpPartyIdForLthing(mp, periodId)
}

const getMpListDetails = (mp, periodId) => ({
  id: mp.id,
  mpName: mp.mpName,
  slug: mp.slug,
  imagePath: mp.imagePath,
  partyId: getMpPartyId(mp, periodId),
})

const isSubstituteForPeriod = (mp, periodId) => {
  if (periodId.indexOf('-') !== -1) {
    // It's a term id
    const term = getTermFromId(periodId)

    if (!term) {
      return null
    }

    const mpsLthings = mp.lthings
    const lthingsInTerm = term.lthings
    const relevantLthings = mpsLthings.filter((lthingInfo) =>
      lthingsInTerm.includes(lthingInfo.lthing.toString()),
    )

    return relevantLthings.every(({ isSubstitute }) => isSubstitute)
  }

  // It's a lthing
  const lthingInfo = mp.lthings.find(
    (lthingInfo) => Number(lthingInfo.lthing) === Number(periodId),
  )

  if (!lthingInfo) {
    return false
  }

  return lthingInfo.isSubstitute
}

export function createMpFileTransformer() {
  const mps = loadFile('data/v2/mps.json')
  const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')
  const mpsByTerm = loadFile('data/v2/mps-by-term.json')

  const mpsWithoutSubstitutes = mps.filter(
    (mp) => !mp.lthings.every((lthingInfo) => lthingInfo.isSubstitute),
  )

  // All mps and their details
  writeToFile(mps, EXPORT_PATH + '/mps/list.json')

  // Without substitutes
  writeToFile(
    mpsWithoutSubstitutes,
    EXPORT_PATH + '/mps/list-without-substitutes.json',
  )

  const mpLookup = mps.reduce((result, mp) => {
    result[mp.id] = mp
    return result
  }, {})

  const lthings = Object.keys(mpsByLthing)

  for (const lthing of lthings) {
    const mps = mpsByLthing[lthing]
    const mpsWithoutSubstitutes = mps.filter(
      (mp) => !isSubstituteForPeriod(mpLookup[mp.id], lthing),
    )
    const mpsWithListDetails = mpsWithoutSubstitutes.map((mp) =>
      getMpListDetails(mpLookup[mp.id], lthing),
    )

    // Mps by lthing
    writeToFile(mpsWithListDetails, `${EXPORT_PATH}/mps/${lthing}/list.json`)
  }

  const terms = Object.keys(mpsByTerm)

  for (const termId of terms) {
    const mps = mpsByTerm[termId]
    const mpsWithoutSubstitutes = mps.filter(
      (mp) => !isSubstituteForPeriod(mpLookup[mp.id], termId),
    )
    const mpsWithListDetails = mpsWithoutSubstitutes.map((mp) =>
      getMpListDetails(mpLookup[mp.id], termId),
    )

    // Mps by term
    writeToFile(mpsWithListDetails, `${EXPORT_PATH}/mps/${termId}/list.json`)
  }

  // Similar votes
  const mpsSimilarVotesByLthing = loadFile(
    'data/export-v2/by-lthing/mp-similar-votes.json',
  )
  const mpsSimilarVotesByTerm = loadFile(
    'data/export-v2/total/mp-similar-votes.json',
  )

  for (const lthing of Object.keys(mpsSimilarVotesByLthing)) {
    const mpSimilarVotesForLthing = mpsSimilarVotesByLthing[lthing]

    for (const mpId of Object.keys(mpSimilarVotesForLthing)) {
      const similarMps = mpSimilarVotesForLthing[mpId]

      // By lthing
      writeToFile(
        similarMps,
        `${EXPORT_PATH}/mps/${lthing}/${mpId}/similar-votes.json`,
      )
    }
  }

  for (const termId of Object.keys(mpsSimilarVotesByTerm)) {
    const mpSimilarVotesForTerm = mpsSimilarVotesByTerm[termId]

    for (const mpId of Object.keys(mpSimilarVotesForTerm)) {
      const similarMps = mpSimilarVotesForTerm[mpId]

      // By term
      writeToFile(
        similarMps,
        `${EXPORT_PATH}/mps/${termId}/${mpId}/similar-votes.json`,
      )
    }
  }

  // Different votes
  const mpsDifferentVotesByLthing = loadFile(
    'data/export-v2/by-lthing/mp-different-votes.json',
  )
  const mpsDifferentVotesByTerm = loadFile(
    'data/export-v2/total/mp-different-votes.json',
  )

  for (const lthing of Object.keys(mpsDifferentVotesByLthing)) {
    const mpDifferentVotesForLthing = mpsDifferentVotesByLthing[lthing]

    for (const mpId of Object.keys(mpDifferentVotesForLthing)) {
      const differentMps = mpDifferentVotesForLthing[mpId]

      // By lthing
      writeToFile(
        differentMps,
        `${EXPORT_PATH}/mps/${lthing}/${mpId}/different-votes.json`,
      )
    }
  }

  for (const termId of Object.keys(mpsDifferentVotesByTerm)) {
    const mpDifferentVotesForTerm = mpsDifferentVotesByTerm[termId]

    for (const mpId of Object.keys(mpDifferentVotesForTerm)) {
      const differentMps = mpDifferentVotesForTerm[mpId]

      // By term
      writeToFile(
        differentMps,
        `${EXPORT_PATH}/mps/${termId}/${mpId}/different-votes.json`,
      )
    }
  }
}
