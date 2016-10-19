import { loadFile, writeToFile } from '../../utility/file'

const mps = loadFile('data/mps.json')
const subjects = loadFile('data/subjects-for-term.json')
const allVotesForTerm = loadFile('data/all-votes-for-term.json')

console.log('Loaded all data needed, derp!')

const globalVoteTypes = {}
const uniqueSubjectsMap = {}
const uniqueTagsMap = {}

function updateOccuranceCount(occuranceMap, mpId, word, vote) {
  if (!occuranceMap[mpId][word]) {
    occuranceMap[mpId][word] = {}
  }

  if (!occuranceMap[mpId][word][vote]) {
    occuranceMap[mpId][word][vote] = 0
  }

  occuranceMap[mpId][word][vote]++
}

function createOccuranceMaps() {
  const subjectOccuranceMap = {}
  const tagOccuranceMap = {}

  allVotesForTerm.forEach(term => {
    term.votes.forEach(mpVotes => {
      subjectOccuranceMap[mpVotes.mpId] = {}
      tagOccuranceMap[mpVotes.mpId] = {}

      mpVotes.votes.forEach(voteTopic => {
        const topicId = voteTopic.id
        const subjectWords = subjects[topicId].words.subjects
        const tagWords = subjects[topicId].words.tags

        voteTopic.votes.forEach(vote => {
          const voteValue = vote.vote

          if (!globalVoteTypes[voteValue]) {
            globalVoteTypes[voteValue] = true
          }

          subjectWords.forEach(word => {
            if (!uniqueSubjectsMap[word]) {
              uniqueSubjectsMap[word] = true
            }

            updateOccuranceCount(
              subjectOccuranceMap,
              mpVotes.mpId,
              word,
              voteValue
            )
          })

          tagWords.forEach(word => {
            if (!uniqueTagsMap[word]) {
              uniqueTagsMap[word] = true
            }

            updateOccuranceCount(
              tagOccuranceMap,
              mpVotes.mpId,
              word,
              voteValue
            )
          })
        })
      })
    })
  })

  return {
    subjects: subjectOccuranceMap,
    tags: tagOccuranceMap,
  }
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
    }).map(word => {
      return {
        word,
        occurance: occuranceMap[mpId][word][voteType]
      }
    })
  }
  return []
}

function generateTopListsForMp(voteTypes, occuranceMaps, mpId, words) {
  const topList = voteTypes.map(voteType => {
    const topSubjects = getTopListOf(
      occuranceMaps.subjects,
      mpId,
      voteType,
      words.subjects
    )

    const topTags = getTopListOf(
      occuranceMaps.tags,
      mpId,
      voteType,
      words.tags
    )

    return {
      voteType,
      subjects: topSubjects.slice(0, 10),
      tags: topTags.slice(0, 10),
    }
  }).filter(voteType => voteType.subjects.length || voteType.tags.length)

  return topList
}

function createSortedSummaryList(typeOccuranceMap, totalOccuranceMap) {
  const wordsInSummary = Object.keys(typeOccuranceMap)
  const typeOccuranceMapSorted = wordsInSummary.map(word => {
    const occuranceRatio = typeOccuranceMap[word] / totalOccuranceMap[word]
    return {
      word,
      occurance: typeOccuranceMap[word],
      occuranceRatio: parseFloat(((occuranceRatio * 100).toFixed(2)),
    }
  }).sort((a, b) => {
    return b.occuranceRatio - a.occuranceRatio
  })

  return typeOccuranceMapSorted
}

function process() {
  const occuranceMaps = createOccuranceMaps()
  const voteTypes = Object.keys(globalVoteTypes)

  console.log('Vote types')
  console.log(voteTypes)

  const uniqueSubjects = Object.keys(uniqueSubjectsMap)
  const uniqueTags = Object.keys(uniqueTagsMap)

  console.log(`\nWords that occured (${uniqueSubjects.length} and tags: ${uniqueTags.length})`)
  console.log(uniqueSubjects)
  console.log(uniqueTags)
  const summary = []
  const mpVoteSplitSummary = {}

  mps.forEach(mp => {
    if (occuranceMaps.subjects[mp.id] !== undefined) {
      const subjectWords = Object.keys(occuranceMaps.subjects[mp.id])
      const tagWords = Object.keys(occuranceMaps.tags[mp.id])

      const topLists = generateTopListsForMp(
        voteTypes,
        occuranceMaps,
        mp.id,
        {
          subjects: subjectWords,
          tags: tagWords,
        }
      )

      const topSummary = {}
      const totalVotesForSubject = {}

      const standsTakenSummary = {}
      const idleSummary = {}
      const awaySummary = {}

      const subjectOccuranceForMp = occuranceMaps.subjects[mp.id]
      const mpSubjects = Object.keys(subjectOccuranceForMp)
      mpSubjects.forEach(subject => {
        const mpSubjectVoteTypes = Object.keys(subjectOccuranceForMp[subject])
        mpSubjectVoteTypes.forEach(voteType => {
          const subjectOccurance = subjectOccuranceForMp[subject][voteType]
          if (voteType === 'já' || voteType === 'nei') {
            if (!topSummary[subject]) {
              topSummary[subject] = 0
            }
            topSummary[subject] += subjectOccurance

            if (!standsTakenSummary[subject]) {
              standsTakenSummary[subject] = 0
            }
            standsTakenSummary[subject] += subjectOccurance
          } else if (voteType === 'greiðir ekki atkvæði') {
            if (!idleSummary[subject]) {
              idleSummary[subject] = 0
            }
            idleSummary[subject] += subjectOccurance
          } else {
            if (!awaySummary[subject]) {
              awaySummary[subject] = 0
            }
            awaySummary[subject] += subjectOccurance
          }

          if (!totalVotesForSubject[subject]) {
            totalVotesForSubject[subject] = 0
          }
          totalVotesForSubject[subject] += subjectOccurance
        })
      })

      const wordsInTopSummary = Object.keys(topSummary)
      const topSummarySorted = wordsInTopSummary.map(word => {
        return {
          word,
          occurance: topSummary[word],
          occuranceRatio: topSummary[word] / totalVotesForSubject[word],
        }
      }).sort((a, b) => {
        return b.occuranceRatio - a.occuranceRatio
      })

      summary.push({
        name: mp.name,
        summary: topSummarySorted.slice(0, 15).map(topSubject => {
          const { word, occurance, occuranceRatio } = topSubject
          return `${word}: ${occurance} (${(occuranceRatio * 100).toFixed(2)})`
        }),
        top: topLists,
      })

      const sortedStandsTaken = createSortedSummaryList(standsTakenSummary, totalVotesForSubject)
      const sortedIdles = createSortedSummaryList(idleSummary, totalVotesForSubject)
      const sortedAways = createSortedSummaryList(awaySummary, totalVotesForSubject)

      console.log(`Adding split votes for ${mp.name} (${mp.id})`)
      mpVoteSplitSummary[mp.id] = {
        standsTaken: sortedStandsTaken,
        idle: sortedIdles,
        away: sortedAways,
      }
    }
  })

  writeToFile(summary, 'data/term/mp-positions.json', true)
  writeToFile(mpVoteSplitSummary, 'data/export/mp-positions.json', true)
}

export default process
