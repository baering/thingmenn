import { loadFile, writeToFile } from '../../utility/file'
import {
  getMpToPartyLookup,
} from '../helpers'

const mpSpeechAnalytics = loadFile('data/v2/mp-speech-statistics.json')

export default function process() {
  const mpToPartyId = getMpToPartyLookup()

  const mpSpeechSummaryByLthing = {}
  const mpSpeechSummaryTotal = {}

  const partySpeechSummaryByLthing = {}
  const partySpeechSummaryTotal = {}

  const lthings = Object.keys(mpSpeechAnalytics)
  lthings.forEach(lthing => {
    mpSpeechSummaryByLthing[lthing] = {}
    partySpeechSummaryByLthing[lthing] = {}

    Object.keys(mpSpeechAnalytics[lthing]).forEach(mpId => {
      if (mpSpeechSummaryByLthing[lthing][mpId] === undefined) {
        mpSpeechSummaryByLthing[lthing][mpId] = {}
      }

      if (mpSpeechSummaryTotal[mpId] === undefined) {
        mpSpeechSummaryTotal[mpId] = {}
      }

      const mpPartyId = mpToPartyId[lthing][mpId]

      if (partySpeechSummaryByLthing[lthing][mpPartyId] === undefined) {
        partySpeechSummaryByLthing[lthing][mpPartyId] = {}
      }

      if (partySpeechSummaryTotal[mpPartyId] === undefined) {
        partySpeechSummaryTotal[mpPartyId] = {}
      }

      const labels = Object.keys(mpSpeechAnalytics[lthing][mpId])
      labels.forEach(label => {
        if (mpSpeechSummaryByLthing[lthing][mpId][label] === undefined) {
          mpSpeechSummaryByLthing[lthing][mpId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (!mpSpeechSummaryTotal[mpId][label]) {
          mpSpeechSummaryTotal[mpId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (partySpeechSummaryByLthing[lthing][mpPartyId][label] === undefined) {
          partySpeechSummaryByLthing[lthing][mpPartyId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        if (partySpeechSummaryTotal[mpPartyId][label] === undefined) {
          partySpeechSummaryTotal[mpPartyId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        const countForLabel = mpSpeechAnalytics[lthing][mpId][label].count
        const minutesForLabel = mpSpeechAnalytics[lthing][mpId][label].minutes

        if (countForLabel) {
          mpSpeechSummaryByLthing[lthing][mpId][label].count += countForLabel
          mpSpeechSummaryByLthing[lthing][mpId][label].minutes += minutesForLabel

          mpSpeechSummaryTotal[mpId][label].count += countForLabel
          mpSpeechSummaryTotal[mpId][label].minutes += minutesForLabel

          partySpeechSummaryByLthing[lthing][mpPartyId][label].count += countForLabel
          partySpeechSummaryByLthing[lthing][mpPartyId][label].minutes += minutesForLabel

          partySpeechSummaryTotal[mpPartyId][label].count += countForLabel
          partySpeechSummaryTotal[mpPartyId][label].minutes += minutesForLabel
        }
      })
    })
  })

  writeToFile(mpSpeechSummaryByLthing, 'data/export-v2/by-lthing/mp-speech-summaries.json', true)
  writeToFile(mpSpeechSummaryTotal, 'data/export-v2/total/mp-speech-summaries.json', true)

  writeToFile(partySpeechSummaryByLthing, 'data/export-v2/by-lthing/party-speech-summaries.json', true)
  writeToFile(partySpeechSummaryTotal, 'data/export-v2/total/party-speech-summaries.json', true)
}
