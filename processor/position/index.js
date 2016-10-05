import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/mps.json')
const subjects = loadFile('data/subjects.json')
const allVotes = loadFile('data/all-votes.json')

console.log('Loaded all data needed, derp!')

const globalVoteTypes = {}
const globalWordTypes = {}

function createOccuranceMap() {
  const occuranceMap = {}

  allVotes.forEach(mpVotes => {
    occuranceMap[mpVotes.mpId] = {}

    mpVotes.votes.forEach(voteTopic => {
      const topicId = voteTopic.id
      const subjectWords = subjects[topicId].words.subjects

      voteTopic.votes.forEach(vote => {
        const voteValue = vote.vote

        if (!globalVoteTypes[voteValue]) {
          globalVoteTypes[voteValue] = true
        }

        subjectWords.forEach(word => {
          if (!globalWordTypes[word]) {
            globalWordTypes[word] = true
          }

          if (!occuranceMap[mpVotes.mpId][word]) {
            occuranceMap[mpVotes.mpId][word] = {}
          }

          if (!occuranceMap[mpVotes.mpId][word][voteValue]) {
            occuranceMap[mpVotes.mpId][word][voteValue] = 0
          }

          occuranceMap[mpVotes.mpId][word][voteValue]++
        })
      })
    })
  })

  return occuranceMap
}

function getTopListOf(occuranceMap, mpId, voteType, words) {
  const wordsThatHaveType = []

  words.forEach(word => {
    if (occuranceMap[mpId][word][voteType] !== undefined) {
      wordsThatHaveType.push(word)
    }
  })

  if (wordsThatHaveType.length) {
    return wordsThatHaveType.sort((a, b) => {
      const occurancesForA = occuranceMap[mpId][a][voteType]
      const occurancesForB = occuranceMap[mpId][b][voteType]

      return occurancesForB - occurancesForA
    }).map(word => `${word}: ${occuranceMap[mpId][word][voteType]}`)
  }
  return []
}

function generateTopListsForMp(voteTypes, occuranceMap, mpId, words) {
  const topLists = voteTypes.map(voteType => {
    const topList = getTopListOf(
      occuranceMap,
      mpId,
      voteType,
      words
    )

    return {
      voteType,
      words: topList,
    }
  })

  return topLists.filter(topList => topList.words.length)
}

function process() {
  const occuranceMap = createOccuranceMap()
  const voteTypes = Object.keys(globalVoteTypes)

  console.log('Vote types')
  console.log(voteTypes)

  const uniqueWords = Object.keys(globalWordTypes)

  console.log(`\nWords that occured (${uniqueWords.length})`)
  console.log(uniqueWords)
  const summary = []
  mps.forEach(mp => {
    if (occuranceMap[mp.id] !== undefined) {
      const words = Object.keys(occuranceMap[mp.id])

      summary.push({
        name: mp.name,
        top: generateTopListsForMp(
          voteTypes,
          occuranceMap,
          mp.id,
          words
        ),
      })
    }
  })

  writeToFile(summary, 'data/mp-positions.json', true)
}

export default process
