import { loadFile, writeToFile } from '../../utility/file'

const mpSpeechAnalytics = loadFile('data/v2/mp-speech-statistics.json')

export default function process() {
  const mpSpeechSummaryByLthing = {}
  const mpSpeechSummaryTotal = {}

  const lthings = Object.keys(mpSpeechAnalytics)
  lthings.forEach(lthing => {
    mpSpeechSummaryByLthing[lthing] = {}

    Object.keys(mpSpeechAnalytics[lthing]).forEach(mpId => {
      if (mpSpeechSummaryByLthing[lthing][mpId] === undefined) {
        mpSpeechSummaryByLthing[lthing][mpId] = {}
      }

      if (mpSpeechSummaryTotal[mpId] === undefined) {
        mpSpeechSummaryTotal[mpId] = {}
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

        const countForLabel = mpSpeechAnalytics[lthing][mpId][label].count
        const minutesForLabel = mpSpeechAnalytics[lthing][mpId][label].minutes

        if (countForLabel) {
          mpSpeechSummaryByLthing[lthing][mpId][label].count += countForLabel
          mpSpeechSummaryByLthing[lthing][mpId][label].minutes += minutesForLabel

          mpSpeechSummaryTotal[mpId][label].count += countForLabel
          mpSpeechSummaryTotal[mpId][label].minutes += minutesForLabel
        }
      })
    })
  })

  writeToFile(mpSpeechSummaryByLthing, 'data/export-v2/by-lthing/mp-speech-summaries.json', true)
  writeToFile(mpSpeechSummaryTotal, 'data/export-v2/total/mp-speech-summaries.json', true)
}
