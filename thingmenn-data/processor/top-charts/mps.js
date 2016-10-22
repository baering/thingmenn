import { loadFile, writeToFile } from '../../utility/file'

let mps = loadFile('data/export/mps.json')
mps = mps.filter(mp => !mp.isSubstitute)
const mpVoteSummary = loadFile('data/export/mp-vote-summaries.json')
const mpSpeechStatistics = loadFile('data/export/mp-speech-statistics.json')

function getMpAttendance(mp) {
  const summaryForMp = mpVoteSummary[mp.id].votePercentages
  return 100 - summaryForMp.away
}

function getTopAttendance() {
  return mps.sort((a, b) => {
    return getMpAttendance(b) - getMpAttendance(a)
  }).map(mp => {
    return {
      mp,
      attendance: getMpAttendance(mp)
    }
  })
}

function getMpStandsTaken(mp) {
  const summaryForMp = mpVoteSummary[mp.id].votePercentages
  return summaryForMp.standsTaken
}

function getTopStandsTaken() {
  return mps.sort((a, b) => {
    return getMpStandsTaken(b) - getMpStandsTaken(a)
  }).map(mp => {
    return {
      mp,
      standsTaken: getMpAttendance(mp)
    }
  })
}

function getMpMinutesTalked(mp) {
  const speechStatistics = mpSpeechStatistics[mp.id]
  return speechStatistics.Samtals.minutes
}

function getTopMinutesTalked() {
  return mps.sort((a, b) => {
    return getMpMinutesTalked(b) - getMpMinutesTalked(a)
  }).map(mp => {
    return {
      mp,
      minutesTalked: getMpMinutesTalked(mp)
    }
  })
}

export default function process() {
  const topLists = {
    attendance: getTopAttendance(),
    standsTaken: getTopStandsTaken(),
    minutesTalked: getTopMinutesTalked(),
  }

  writeToFile(topLists.attendance, 'data/export/mp-top-attendance.json', true)
  writeToFile(topLists.standsTaken, 'data/export/mp-top-stands-taken.json', true)
  writeToFile(topLists.minutesTalked, 'data/export/mp-top-minutes-talked.json', true)
}
