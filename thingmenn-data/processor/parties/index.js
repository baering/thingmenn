import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/mps.json')
const mpNouns = loadFile('data/export/mp-noun-lookup.json')
const mpPositions = loadFile('data/export/mp-positions.json')
const mpSimilarVotes = loadFile('data/export/mp-similar-votes.json')
const mpVoteSummaries = loadFile('data/export/mp-vote-summaries.json')

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
        numberOfIdleVotes: 0,
        numberOfStandsTaken: 0,
        numberOfVotes: 0,
      },
      voteTypes: {}
    }
  }

  voteSummary[mp.party].voteSummary.numberOfAway += mpVoteSummary.voteSummary.numberOfAway
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
    voteSummary[party].votePercentages = {
      standsTaken: parseFloat((standsTaken * 100).toFixed(1)),
      idle: parseFloat((idle * 100).toFixed(1)),
      away: parseFloat((away * 100).toFixed(1)),
    }
  })
}

function updateNounSummary(nounSummary, topNounsForMp, mp) {
  if (!nounSummary[mp.party]) {
    nounSummary[mp.party] = {}
  }

  topNounsForMp.forEach(noun => {
    if (!nounSummary[mp.party][noun.noun]) {
      nounSummary[mp.party][noun.noun] = 0
    }

    nounSummary[mp.party][noun.noun] += noun.occurance
  })
}

function getTopNouns(nounSummary, partyNames) {
  const topPartyNouns = {}
  partyNames.forEach(partyName => {
    const partyNounSummary = nounSummary[partyName]

    const nouns = Object.keys(partyNounSummary)
    topPartyNouns[partyName] = nouns.sort((a, b) => {
      const occuranceA = nounSummary[partyName][a]
      const occuranceB = nounSummary[partyName][b]

      return occuranceB - occuranceA
    }).slice(0, 20).map(noun => {
      return {
        noun,
        occurance: nounSummary[partyName][noun]
      }
    })
  })

  return topPartyNouns
}

// TODO: Need to revisit this, not enough to know how many votes
//       are similar, need to know which votes to not recount

// function updateSimilarVoteSummary(similarVoteSummary, mpSimilarVotes, mp) {
//   if (!similarVoteSummary[mp.party]) {
//     similarVoteSummary[mp.party] = {}
//   }
//
//   mpSimilarVotes.forEach(similarVote => {
//     const voteParty = mpIdToParty[similarVote.mpId]
//     if (voteParty !== mp.party) {
//       if (!similarVoteSummary[mp.party][voteParty]) {
//         similarVoteSummary[mp.party][voteParty] = 0
//       }
//
//       similarVoteSummary[mp.party][voteParty] += similarVote.similarVotes
//     }
//   })
// }
//
// function getSortedSimilarVotes(similarVoteSummary, partyNames) {
//   const sortedSimilarVotes = {}
//
//   partyNames.forEach(partyName => {
//     const similarParties = Object.keys(similarVoteSummary[partyName])
//
//     sortedSimilarVotes[partyName] = similarParties.sort((a, b) => {
//       const similarVotesA = similarVoteSummary[partyName][a]
//       const similarVotesB = similarVoteSummary[partyName][b]
//
//       return similarVotesB - similarVotesA
//     }).map(similarPartyName => {
//       return {
//         party: similarPartyName,
//         similarVotes: similarVoteSummary[partyName][similarPartyName],
//       }
//     })
//   })
//
//   return sortedSimilarVotes
// }

function updatePositionSummary(positionSummary, mpPositionSummary, mp) {
  if (!positionSummary[mp.party]) {
    positionSummary[mp.party] = {
      standsTaken: [],
      idle: [],
      away: [],
    }
  }
}

export default function process() {
  const voteSummary = {}
  const nounSummary = {}
  const similarVoteSummary = {}
  const positionSummary = {}

  const partyNames = getPartyNames(mps)

  mps.forEach(mp => {
    updateVoteSummary(voteSummary, mpVoteSummaries[mp.id], mp)
    updateNounSummary(nounSummary, mpNouns[mp.id], mp)
    updateSimilarVoteSummary(similarVoteSummary, mpSimilarVotes[mp.id], mp)
  })
  calculateVotePercentages(partyNames, voteSummary)
  const topPartyNouns = getTopNouns(nounSummary, partyNames)
  const sortedSimilarVoteSummary = getSortedSimilarVotes(
    similarVoteSummary,
    partyNames
  )

  writeToFile(voteSummary, 'data/export/party-vote-summary.json', true)
  writeToFile(topPartyNouns, 'data/export/party-noun-lookup.json', true)
  // writeToFile(sortedSimilarVoteSummary, 'data/export/party-similar-votes.json', true)
}
