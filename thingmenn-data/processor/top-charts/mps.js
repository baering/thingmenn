import { loadFile, writeToFile } from '../../utility/file'
import { getMpToPartyLookup } from '../helpers'

const mpToPartyLookup = getMpToPartyLookup()

function getMpAttendance(mp, mpVoteSummary) {
  if (mpVoteSummary[mp.id] === undefined) {
    console.log(mp.id)
  }
  const summaryForMp = mpVoteSummary[mp.id].votePercentages
  return 100 - summaryForMp.away
}

function getTopAttendance(mps, mpVoteSummary) {
  return mps.filter(mp => mpVoteSummary[mp.id] !== undefined).sort((a, b) =>
    getMpAttendance(b, mpVoteSummary) - getMpAttendance(a, mpVoteSummary)
  ).map(mp => ({
    mp,
    attendance: getMpAttendance(mp, mpVoteSummary),
  }))
}

function getMpStandsTaken(mp, mpVoteSummary) {
  const summaryForMp = mpVoteSummary[mp.id].votePercentages
  return summaryForMp.standsTaken
}

function getTopStandsTaken(mps, mpVoteSummary) {
  return mps.filter(mp => mpVoteSummary[mp.id] !== undefined).sort((a, b) =>
    getMpStandsTaken(b, mpVoteSummary) - getMpStandsTaken(a, mpVoteSummary)
  ).map(mp => ({
    mp,
    standsTaken: getMpStandsTaken(mp, mpVoteSummary),
  }))
}

function getMpMinutesTalked(mp, mpSpeechSummary) {
  const speechSummary = mpSpeechSummary[mp.id]
  return speechSummary.Samtals.minutes
}

function getTopMinutesTalked(mps, mpSpeechSummary) {
  return mps.filter(mp => mpSpeechSummary[mp.id] !== undefined).sort((a, b) =>
    getMpMinutesTalked(b, mpSpeechSummary) - getMpMinutesTalked(a, mpSpeechSummary)
  ).map(mp => ({
    mp,
    minutesTalked: getMpMinutesTalked(mp, mpSpeechSummary),
  }))
}

const mpsNotIncludedInTopCharts = {
  146: {
    692: true,
  },
}

function hasDied(mp, lthing) {
  return mpsNotIncludedInTopCharts[lthing] && mpsNotIncludedInTopCharts[lthing][mp.id]
}

function wasSubstituteInLthing(mp, lthing) {
  for (const lthingInfo of mp.lthings) {
    if (lthingInfo.lthing.toString() === lthing) {
      return lthingInfo.isSubstitute
    }
  }
  return true
}

export default function process() {
  const mps = loadFile('data/v2/mps.json')
  const mpsByLthing = loadFile('data/v2/mps-by-lthing.json')

  const mpLookup = {}
  mps.forEach(mp => mpLookup[mp.id] = mp)

  const mpsByLthingLookup = {}
  Object.keys(mpsByLthing).forEach(lthing => {
    mpsByLthingLookup[lthing] = []
    mpsByLthing[lthing].forEach(mp => {
      const mpDetails = mpLookup[mp.id]

      if (!wasSubstituteInLthing(mpDetails, lthing) && !hasDied(mp, lthing)) {
        mpsByLthingLookup[lthing].push({
          id: mpDetails.id,
          name: mpDetails.mpName,
          partyId: mpToPartyLookup[lthing][mpDetails.id],
        })
      }
    })
  })

  const mpVoteSummary = loadFile('data/export-v2/by-lthing/mp-vote-summaries.json')
  const mpSpeechSummary = loadFile('data/export-v2/by-lthing/mp-speech-summaries.json')

  const topListsByLthing = {
    attendance: {},
    standsTaken: {},
    minutesTalked: {},
  }

  Object.keys(mpsByLthingLookup).forEach(lthing => {
    console.log(lthing)
    const mpVoteSummaryForLthing = mpVoteSummary[lthing]
    const mpSpeechSummaryForLthing = mpSpeechSummary[lthing]

    const mpsInLthing = mpsByLthingLookup[lthing]

    console.log('mps', mpsInLthing.length)

    topListsByLthing.attendance[lthing] = getTopAttendance(mpsInLthing, mpVoteSummaryForLthing)
    topListsByLthing.standsTaken[lthing] = getTopStandsTaken(mpsInLthing, mpVoteSummaryForLthing)
    topListsByLthing.minutesTalked[lthing] = getTopMinutesTalked(mpsInLthing, mpSpeechSummaryForLthing)
  })

  // const topLists = {
  //   attendance: getTopAttendance(),
  //   standsTaken: getTopStandsTaken(),
  //   minutesTalked: getTopMinutesTalked(),
  // }
  //

  writeToFile(topListsByLthing.attendance, 'data/export-v2/by-lthing/mp-top-attendance.json', true)
  writeToFile(topListsByLthing.standsTaken, 'data/export-v2/by-lthing/mp-top-stands-taken.json', true)
  writeToFile(topListsByLthing.minutesTalked, 'data/export-v2/by-lthing/mp-top-minutes-talked.json', true)
}
