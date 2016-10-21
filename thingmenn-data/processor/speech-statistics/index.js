import { loadFile, writeToFile } from '../../utility/file'

// const mps = loadFile('data/export/mps.json')
const mpSpeechAnalytics = loadFile('data/term/mp-speech-statistics.json')

export default function process() {
  const mpSpeechAnalyticsSummary = {}

  const lthings = Object.keys(mpSpeechAnalytics)
  lthings.forEach(lthing => {
    const mpIds = Object.keys(mpSpeechAnalytics[lthing])
    mpIds.forEach(mpId => {
      if (!mpSpeechAnalyticsSummary[mpId]) {
        mpSpeechAnalyticsSummary[mpId] = {}
      }

      const labels = Object.keys(mpSpeechAnalytics[lthing][mpId])
      labels.forEach(label => {
        if (!mpSpeechAnalyticsSummary[mpId][label]) {
          mpSpeechAnalyticsSummary[mpId][label] = {
            count: 0,
            minutes: 0,
          }
        }

        const countForLabel = mpSpeechAnalytics[lthing][mpId][label].count
        const minutesForLabel = mpSpeechAnalytics[lthing][mpId][label].minutes
        if (countForLabel) {
          mpSpeechAnalyticsSummary[mpId][label].count += countForLabel
          mpSpeechAnalyticsSummary[mpId][label].minutes += minutesForLabel
        }
      })
    })
  })

  writeToFile(mpSpeechAnalyticsSummary, 'data/export/mp-speech-statistics.json', true)
}
