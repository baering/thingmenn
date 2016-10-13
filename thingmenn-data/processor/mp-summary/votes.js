import { loadFile, writeToFile } from '../../utility/file'

function createLookup(allVotesForTerm) {
  const reducedLookup = {}
  allVotesForTerm.forEach(term => {
    term.votes.forEach(mp => {
      mp.votes.forEach(voteTopic => {
        const topicId = `${term.lthing}-${voteTopic.id}`

        if (!reducedLookup[topicId]) {
          reducedLookup[topicId] = {
            proposals: {},
          }
        }

        voteTopic.votes.forEach(vote => {
          if (!reducedLookup[topicId].proposals[vote.proposalUrl]) {
            reducedLookup[topicId].proposals[vote.proposalUrl] = {}
          }

          const voteType = vote.vote

          if (!reducedLookup[topicId].proposals[vote.proposalUrl][voteType]) {
            reducedLookup[topicId].proposals[vote.proposalUrl][voteType] = []
          }

          reducedLookup[topicId].proposals[vote.proposalUrl][voteType].push(mp.mpId)
        })
      })
    })
  })

  return reducedLookup
}

export default function createVoteSummary() {
  const mps = loadFile('data/mps.json')
  const allVotesForTerm = loadFile('data/all-votes-for-term.json')

  const reducedLookup = createLookup(allVotesForTerm)

  const mpVoteSummary = {}
  const mpSimilarVotes = {}

  allVotesForTerm.forEach(term => {
    console.log(`Term: ${term.lthing}`)
    term.votes.forEach(mp => {
      if (!mpVoteSummary[mp.mpId]) {
        mpVoteSummary[mp.mpId] = {
          id: mp.mpId,
          name: mp.mpName,
          voteSummary: {
            numberOfVotes: 0,
            numberOfStandsTaken: 0,
            numberOfAway: 0,
            numberOfIdleVotes: 0,
          },
          voteTypes: {},
        }
      }

      mpSimilarVotes[mp.mpId] = {}

      mp.votes.forEach(voteTopic => {
        const topicId = `${term.lthing}-${voteTopic.id}`
        voteTopic.votes.forEach(vote => {
          const voteType = vote.vote

          reducedLookup[topicId].proposals[vote.proposalUrl][voteType].forEach(voterId => {
            if (voterId !== mp.mpId) {
              if (!mpSimilarVotes[mp.mpId][voterId]) {
                mpSimilarVotes[mp.mpId][voterId] = 0
              }

              mpSimilarVotes[mp.mpId][voterId] += 1
            }
          })

          mpVoteSummary[mp.mpId].voteSummary.numberOfVotes += 1
          if (!mpVoteSummary[mp.mpId].voteTypes[voteType]) {
            mpVoteSummary[mp.mpId].voteTypes[voteType] = 0
          }

          mpVoteSummary[mp.mpId].voteTypes[voteType] += 1
        })
      })
    })
  })

  const mpIds = Object.keys(mpVoteSummary)
  mpIds.forEach(mpId => {
    const summary = mpVoteSummary[mpId]
    const voteTypes = Object.keys(summary.voteTypes)
    voteTypes.forEach(voteType => {
      const numberOfVotesForType = summary.voteTypes[voteType]

      if (voteType === 'já' || voteType === 'nei') {
        summary.voteSummary.numberOfStandsTaken += numberOfVotesForType
      } else if (voteType === 'greiðir ekki atkvæði') {
        summary.voteSummary.numberOfIdleVotes += numberOfVotesForType
      } else {
        summary.voteSummary.numberOfAway += numberOfVotesForType
      }
    })

    const numberOfVotes = summary.voteSummary.numberOfVotes
    const standsTaken = summary.voteSummary.numberOfStandsTaken / numberOfVotes
    const standsNotTaken = 1 - standsTaken
    const away = summary.voteSummary.numberOfAway / numberOfVotes
    summary.votePercentages = {
      standsTaken: (standsTaken * 100).toFixed(1),
      standsNotTaken: (standsNotTaken * 100).toFixed(1),
      away: (away * 100).toFixed(1),
    }
  })

  writeToFile(mpVoteSummary, 'data/term/mp-vote-summaries.json', true)
  writeToFile(mpSimilarVotes, 'data/term/mp-similar-votes.json', true)
  writeToFile(reducedLookup, 'data/term/lookup-temp.json', true)
}
