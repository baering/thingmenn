import { loadFile, writeToFile } from '../../utility/file'
import { lthingToTerm } from '../../utility/lthing'
import { getMpToPartyLookup } from '../helpers'

const mpSpeechAnalytics = loadFile('data/v2/mp-speech-statistics.json')

export default function process() {
  const mpToPartyId = getMpToPartyLookup()

  const mpSpeechSummaryByLthing = {}
  const mpSpeechSummaryTotal = {}

  const partySpeechSummaryByLthing = {}
  const partySpeechSummaryTotal = {}

  const lthings = Object.keys(mpSpeechAnalytics)
  lthings.forEach((lthing) => {
    mpSpeechSummaryByLthing[lthing] = {}
    partySpeechSummaryByLthing[lthing] = {}

    const term = lthingToTerm(lthing)

    if (mpSpeechSummaryTotal[term.id] === undefined) {
      mpSpeechSummaryTotal[term.id] = {}
    }

    const mpSpeechSummaryTotalForTerm = mpSpeechSummaryTotal[term.id]

    if (partySpeechSummaryTotal[term.id] === undefined) {
      partySpeechSummaryTotal[term.id] = {}
    }

    const partySpeechSummaryTotalForTerm = partySpeechSummaryTotal[term.id]

    Object.keys(mpSpeechAnalytics[lthing]).forEach((mpId) => {
      if (mpSpeechSummaryByLthing[lthing][mpId] === undefined) {
        mpSpeechSummaryByLthing[lthing][mpId] = {}
      }

      if (mpSpeechSummaryTotalForTerm[mpId] === undefined) {
        mpSpeechSummaryTotalForTerm[mpId] = {}
      }

      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partySpeechSummaryByLthing[lthing][mpPartyId] === undefined) {
        partySpeechSummaryByLthing[lthing][mpPartyId] = {}
      }

      if (partySpeechSummaryTotalForTerm[mpPartyId] === undefined) {
        partySpeechSummaryTotalForTerm[mpPartyId] = {}
      }

      const labels = Object.keys(mpSpeechAnalytics[lthing][mpId])
      labels.forEach((label) => {
        if (mpSpeechSummaryByLthing[lthing][mpId][label] === undefined) {
          mpSpeechSummaryByLthing[lthing][mpId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (!mpSpeechSummaryTotalForTerm[mpId][label]) {
          mpSpeechSummaryTotalForTerm[mpId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (
          partySpeechSummaryByLthing[lthing][mpPartyId][label] === undefined
        ) {
          partySpeechSummaryByLthing[lthing][mpPartyId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (partySpeechSummaryTotalForTerm[mpPartyId][label] === undefined) {
          partySpeechSummaryTotalForTerm[mpPartyId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        const countForLabel = mpSpeechAnalytics[lthing][mpId][label].count
        const minutesForLabel = mpSpeechAnalytics[lthing][mpId][label].minutes

        if (countForLabel) {
          mpSpeechSummaryByLthing[lthing][mpId][label].count += countForLabel
          mpSpeechSummaryByLthing[lthing][mpId][label].minutes +=
            minutesForLabel

          mpSpeechSummaryTotalForTerm[mpId][label].count += countForLabel
          mpSpeechSummaryTotalForTerm[mpId][label].minutes += minutesForLabel

          partySpeechSummaryByLthing[lthing][mpPartyId][label].count +=
            countForLabel
          partySpeechSummaryByLthing[lthing][mpPartyId][label].minutes +=
            minutesForLabel

          partySpeechSummaryTotalForTerm[mpPartyId][label].count +=
            countForLabel
          partySpeechSummaryTotalForTerm[mpPartyId][label].minutes +=
            minutesForLabel
        }
      })
    })
  })

  writeToFile(
    mpSpeechSummaryByLthing,
    'data/export-v2/by-lthing/mp-speech-summaries.json',
    true,
  )
  writeToFile(
    mpSpeechSummaryTotal,
    'data/export-v2/total/mp-speech-summaries.json',
    true,
  )

  writeToFile(
    partySpeechSummaryByLthing,
    'data/export-v2/by-lthing/party-speech-summaries.json',
    true,
  )
  writeToFile(
    partySpeechSummaryTotal,
    'data/export-v2/total/party-speech-summaries.json',
    true,
  )
}
