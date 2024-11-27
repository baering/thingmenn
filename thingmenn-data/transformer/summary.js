import { loadFile, writeToFile } from '../utility/file'
import { EXPORT_PATH } from './constants'

function processSummaryFiles(summaryConfig) {
  for (const { filePath, fileName, type } of summaryConfig) {
    const summariesByLthing = loadFile(filePath.byLthing)
    const summariesByTerm = loadFile(filePath.byTerm)

    // Validate data
    if (!summariesByLthing) {
      console.warn(
        `Warning: Could not load data from ${filePath.byLthing}. Skipping...`,
      )
      continue
    }
    if (!summariesByTerm) {
      console.warn(
        `Warning: Could not load data from ${filePath.byTerm}. Skipping...`,
      )
      continue
    }

    // Process by lthing
    for (const lthing of Object.keys(summariesByLthing)) {
      const summariesForLthing = summariesByLthing[lthing]
      for (const mpId of Object.keys(summariesForLthing)) {
        const summary = summariesForLthing[mpId]
        writeToFile(
          summary,
          `${EXPORT_PATH}/${type}/${lthing}/${mpId}/${fileName}.json`,
        )
      }
    }

    // Process by term
    for (const termId of Object.keys(summariesByTerm)) {
      const summariesForTerm = summariesByTerm[termId]
      for (const mpId of Object.keys(summariesForTerm)) {
        const summary = summariesForTerm[mpId]
        writeToFile(
          summary,
          `${EXPORT_PATH}/${type}/${termId}/${mpId}/${fileName}.json`,
        )
      }
    }
  }
}

const SummaryType = {
  MP: 'mps',
  PARTY: 'parties',
}

export function createMpSummaryFileTransformer() {
  const summaryConfig = [
    // mps
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-vote-summaries.json',
        byTerm: 'data/export-v2/total/mp-vote-summaries.json',
      },
      fileName: 'vote-summary',
      type: SummaryType.MP,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-speech-summaries.json',
        byTerm: 'data/export-v2/total/mp-speech-summaries.json',
      },
      fileName: 'speech-summary',
      type: SummaryType.MP,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-document-summaries.json',
        byTerm: 'data/export-v2/total/mp-document-summaries.json',
      },
      fileName: 'document-summary',
      type: SummaryType.MP,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-vote-positions.json',
        byTerm: 'data/export-v2/total/mp-vote-positions.json',
      },
      fileName: 'vote-positions',
      type: SummaryType.MP,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-speech-positions.json',
        byTerm: 'data/export-v2/total/mp-speech-positions.json',
      },
      fileName: 'speech-positions',
      type: SummaryType.MP,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/mp-document-positions.json',
        byTerm: 'data/export-v2/total/mp-document-positions.json',
      },
      fileName: 'document-positions',
      type: SummaryType.MP,
    },
    // parties
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-vote-summaries.json',
        byTerm: 'data/export-v2/total/party-vote-summaries.json',
      },
      fileName: 'vote-summary',
      type: SummaryType.PARTY,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-speech-summaries.json',
        byTerm: 'data/export-v2/total/party-speech-summaries.json',
      },
      fileName: 'speech-summary',
      type: SummaryType.PARTY,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-document-summaries.json',
        byTerm: 'data/export-v2/total/party-document-summaries.json',
      },
      fileName: 'document-summary',
      type: SummaryType.PARTY,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-vote-positions.json',
        byTerm: 'data/export-v2/total/party-vote-positions.json',
      },
      fileName: 'vote-positions',
      type: SummaryType.PARTY,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-speech-positions.json',
        byTerm: 'data/export-v2/total/party-speech-positions.json',
      },
      fileName: 'speech-positions',
      type: SummaryType.PARTY,
    },
    {
      filePath: {
        byLthing: 'data/export-v2/by-lthing/party-document-positions.json',
        byTerm: 'data/export-v2/total/party-document-positions.json',
      },
      fileName: 'document-positions',
      type: SummaryType.PARTY,
    },
  ]

  processSummaryFiles(summaryConfig)

  // Absent summaries
  const mpAbsentSummariesByLthing = loadFile(
    'data/export-v2/by-lthing/mp-absent-day-time-summary.json',
  )
  const mpAbsentSummariesByTerm = loadFile(
    'data/export-v2/total/mp-absent-day-time-summary.json',
  )

  for (const lthing of Object.keys(mpAbsentSummariesByLthing)) {
    const mpAbsentSummariesForLthing = mpAbsentSummariesByLthing[lthing].byMp

    for (const mpId of Object.keys(mpAbsentSummariesForLthing)) {
      const absentSummaries = mpAbsentSummariesForLthing[mpId]

      // By lthing
      writeToFile(
        absentSummaries,
        `${EXPORT_PATH}/mps/${lthing}/${mpId}/absent-summary.json`,
      )
    }
  }

  for (const termId of Object.keys(mpAbsentSummariesByTerm)) {
    const mpAbsentSummariesForTerm = mpAbsentSummariesByTerm[termId].byMp

    for (const mpId of Object.keys(mpAbsentSummariesForTerm)) {
      const absentSummaries = mpAbsentSummariesForTerm[mpId]

      // By term
      writeToFile(
        absentSummaries,
        `${EXPORT_PATH}/mps/${termId}/${mpId}/absent-summary.json`,
      )
    }
  }

  // Absent summaries by party
  for (const lthing of Object.keys(mpAbsentSummariesByLthing)) {
    const partyAbsentSummariesForLthing =
      mpAbsentSummariesByLthing[lthing].byParty

    for (const partyId of Object.keys(partyAbsentSummariesForLthing)) {
      const absentSummaries = partyAbsentSummariesForLthing[partyId]

      // By lthing
      writeToFile(
        absentSummaries,
        `${EXPORT_PATH}/parties/${lthing}/${partyId}/absent-summary.json`,
      )
    }
  }

  for (const termId of Object.keys(mpAbsentSummariesByTerm)) {
    const partyAbsentSummariesForTerm = mpAbsentSummariesByTerm[termId].byParty

    for (const partyId of Object.keys(partyAbsentSummariesForTerm)) {
      const absentSummaries = partyAbsentSummariesForTerm[partyId]

      // By term
      writeToFile(
        absentSummaries,
        `${EXPORT_PATH}/parties/${termId}/${partyId}/absent-summary.json`,
      )
    }
  }
}
