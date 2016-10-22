import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/export/mps.json')
const mpVoteSummaries = loadFile('data/export/mp-vote-summaries.json')
const mpSpeechStatistics = loadFile('data/export/mp-speech-statistics.json')
const mpPositionsSummary = loadFile('data/export/mp-positions-processed.json')

const mpIdToParty = {}

function getPartyNames() {
  const partyNames = {}
  mps.forEach(mp => {
    partyNames[mp.party] = true
    mpIdToParty[mp.id] = mp.party
  })
  return Object.keys(partyNames)
}

function updateVoteSummary(voteSummary, mpVoteSummary, mp) {
  if (!voteSummary[mp.party]) {
    voteSummary[mp.party] = {
      voteSummary: {
        numberOfAway: 0,
        numberOfAbsent: 0,
        numberOfIdleVotes: 0,
        numberOfStandsTaken: 0,
        numberOfVotes: 0,
      },
      voteTypes: {}
    }
  }

  voteSummary[mp.party].voteSummary.numberOfAway += mpVoteSummary.voteSummary.numberOfAway
  voteSummary[mp.party].voteSummary.numberOfAbsent += mpVoteSummary.voteSummary.numberOfAbsent
  voteSummary[mp.party].voteSummary.numberOfIdleVotes += mpVoteSummary.voteSummary.numberOfIdleVotes
  voteSummary[mp.party].voteSummary.numberOfStandsTaken += mpVoteSummary.voteSummary.numberOfStandsTaken
  voteSummary[mp.party].voteSummary.numberOfVotes += mpVoteSummary.voteSummary.numberOfVotes

  const mpVoteTypes = Object.keys(mpVoteSummary.voteTypes)
  mpVoteTypes.forEach(voteType => {
    if (!voteSummary[mp.party].voteTypes[voteType]) {
      voteSummary[mp.party].voteTypes[voteType] = 0
    }
    voteSummary[mp.party].voteTypes[voteType] += mpVoteSummary.voteTypes[voteType]
  })
}

function calculateVotePercentages(partyNames, voteSummary) {
  partyNames.forEach(party => {
    const numberOfVotes = voteSummary[party].voteSummary.numberOfVotes
    const standsTaken = voteSummary[party].voteSummary.numberOfStandsTaken / numberOfVotes
    const idle = voteSummary[party].voteSummary.numberOfIdleVotes / numberOfVotes
    const away = voteSummary[party].voteSummary.numberOfAway / numberOfVotes
    const absent = voteSummary[party].voteSummary.numberOfAbsent / numberOfVotes
    voteSummary[party].votePercentages = {
      standsTaken: parseFloat((standsTaken * 100).toFixed(2)),
      idle: parseFloat((idle * 100).toFixed(2)),
      away: parseFloat((away * 100).toFixed(2)),
      absent: parseFloat((absent * 100).toFixed(2)),
    }
  })
}

function updateSpeechStatistics(speechStatistics, mpSpeechStatistics, mp) {
  if (!speechStatistics[mp.partySlug]) {
    speechStatistics[mp.partySlug] = {}
  }

  const labels = Object.keys(mpSpeechStatistics)
  labels.forEach(label => {
    if (!speechStatistics[mp.partySlug][label]) {
      speechStatistics[mp.partySlug][label] = {
        count: 0,
        minutes: 0,
      }
    }

    const labelInfo = mpSpeechStatistics[label]
    const mpLabelMinutes = Number(labelInfo.minutes.toFixed(2))

    speechStatistics[mp.partySlug][label].count += labelInfo.count
    speechStatistics[mp.partySlug][label].minutes += mpLabelMinutes
  })
}

function updateSubjectSummary(subjectSummary, voteSplit, key) {
  if (!subjectSummary[key]) {
    subjectSummary[key] = {
      occurance: 0,
      percentage: 0,
    }
  }

  subjectSummary[key].occurance += voteSplit[key].occurance
  subjectSummary[key].percentage += voteSplit[key].percentage
}

function updatePositions(positionSummary, mpPositionSummary, mp) {
  if (!positionSummary[mp.partySlug]) {
    positionSummary[mp.partySlug] = {}
  }

  mpPositionSummary.forEach(subjectSummary => {
    if (!positionSummary[mp.partySlug][subjectSummary.subject]) {
      positionSummary[mp.partySlug][subjectSummary.subject] = {
        count: 0,
      }
    }

    const voteSplit = subjectSummary.voteSplit
    const subjectSummaryToUpdate = positionSummary[mp.partySlug][subjectSummary.subject]
    if (voteSplit.standsTaken) {
      updateSubjectSummary(subjectSummaryToUpdate, voteSplit, 'standsTaken')
    }

    if (voteSplit.idle) {
      updateSubjectSummary(subjectSummaryToUpdate, voteSplit, 'idle')
    }

    if (voteSplit.away) {
      updateSubjectSummary(subjectSummaryToUpdate, voteSplit, 'away')
    }

    subjectSummaryToUpdate.count += 1
  })
}

export default function process() {
  const voteSummary = {}
  const speechStatistics = {}
  const positionSummary = {}
  const partyNames = getPartyNames(mps)

  mps.forEach(mp => {
    updateVoteSummary(voteSummary, mpVoteSummaries[mp.id], mp)
    updateSpeechStatistics(speechStatistics, mpSpeechStatistics[mp.id], mp)
    updatePositions(positionSummary, mpPositionsSummary[mp.id], mp)
  })
  calculateVotePercentages(partyNames, voteSummary)

  writeToFile(voteSummary, 'data/export/party-vote-summary.json', true)
  writeToFile(speechStatistics, 'data/export/party-speech-statistics.json', true)

  const sortedPositionSummary = {}
  const partySlugs = Object.keys(positionSummary)
  partySlugs.forEach(slug => {
    const subjects = Object.keys(positionSummary[slug])
    subjects.forEach(subject => {
      const mpsThatVotedOnSubject = positionSummary[slug][subject].count
      const voteTypes = ['standsTaken', 'idle', 'away']
      voteTypes.forEach(voteType => {
        if (positionSummary[slug][subject][voteType]) {
          const currentPercentage = positionSummary[slug][subject][voteType].percentage
          const realPercentage = currentPercentage / mpsThatVotedOnSubject
          positionSummary[slug][subject][voteType].percentage = realPercentage
        }
      })
    })
  })

  partySlugs.forEach(slug => {
    const subjects = Object.keys(positionSummary[slug])
    sortedPositionSummary[slug] = subjects.sort((a, b) => {
      const subjectSummaryA = positionSummary[slug][a]
      const subjectSummaryB = positionSummary[slug][b]

      const aStand = subjectSummaryA.standsTaken
      const bStand = subjectSummaryB.standsTaken

      if (aStand && bStand) {
        if (aStand.percentage === bStand.percentage) {
          return bStand.occurance - aStand.occurance
        }

        return bStand.percentage - aStand.percentage
      } else if (aStand && !bStand) {
        return -1
      } else if (!aStand && bStand) {
        return 1
      }

      const aIdle = subjectSummaryA.idle
      const bIdle = subjectSummaryB.idle

      if (aIdle && bIdle) {
        return bIdle.percentage - aIdle.percentage
      } else if (aIdle && !bIdle) {
        return -1
      } else if (!aIdle && bIdle) {
        return 1
      }

      const aAway = subjectSummaryA.away
      const bAway = subjectSummaryB.away

      if (aAway && bAway) {
        return bAway.percentage - aAway.percentage
      } else if (aAway && !bAway) {
        return -1
      } else if (!aAway && bAway) {
        return 1
      }
      return 0
    }).map(subject => {
      const subjectSummary = positionSummary[slug][subject]

      return {
        subject,
        voteSplit: {
          standsTaken: subjectSummary.standsTaken,
          idle: subjectSummary.idle,
          away: subjectSummary.away,
        }
      }
    })
  })
  writeToFile(sortedPositionSummary, 'data/export/party-positions.json', true)
}
