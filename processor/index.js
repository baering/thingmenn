import fs from 'fs'
import { writeToFile } from '../utility/file'

const allVotes = JSON.parse(fs.readFileSync('data/all-votes.json', 'utf8'))

function createReducedLookup() {
  const reducedLookup = {}
  allVotes.forEach(mp => {
    mp.votes.forEach(category => {
      const topic = category.topic
      if (!reducedLookup[topic]) {
        reducedLookup[topic] = {
          proposals: {}
        }
      }

      category.votes.forEach(vote => {
        if (!reducedLookup[topic].proposals[vote.proposal]) {
          reducedLookup[topic].proposals[vote.proposal] = {}
        }

        const voteType = vote.vote

        if (!reducedLookup[topic].proposals[vote.proposal][voteType]) {
          reducedLookup[topic].proposals[vote.proposal][voteType] = []
        }

        reducedLookup[topic].proposals[vote.proposal][voteType].push(mp.mpId)
      })
    })
  })

  writeToFile(reducedLookup, 'data/reduced-lookup.json')
  return reducedLookup
}

function createNameLookup() {
  const lookup = {}
  allVotes.forEach(mp => {
    lookup[mp.mpId] = mp.mpName
  })
  return lookup
}

const nameLookup = createNameLookup()

const reducedLookup = createReducedLookup()

const friendLookup = {}

allVotes.forEach(mp => {
  friendLookup[mp.mpId] = {
    name: mp.mpName,
    numberOfVotes: 0,
    voteTypes: {},
    similiarMpVoteCount: {}
  }
  mp.votes.forEach(category => {
    const topic = category.topic

    category.votes.forEach(vote => {
      const voteType = vote.vote

      reducedLookup[topic].proposals[vote.proposal][voteType].forEach(voterId => {
        if (voterId !== mp.mpId) {
          if (!friendLookup[mp.mpId].similiarMpVoteCount[voterId]) {
            friendLookup[mp.mpId].similiarMpVoteCount[voterId] = 0
          }

          friendLookup[mp.mpId].similiarMpVoteCount[voterId] += 1
        }
      })

      friendLookup[mp.mpId].numberOfVotes += 1
      if (!friendLookup[mp.mpId].voteTypes[voteType]) {
        friendLookup[mp.mpId].voteTypes[voteType] = 0
      }

      friendLookup[mp.mpId].voteTypes[voteType] += 1
    })
  })

  const friendIds = Object.keys(friendLookup[mp.mpId].similiarMpVoteCount)
  const sortedFriendIds = friendIds.sort((a, b) => {
    const aValue = friendLookup[mp.mpId].similiarMpVoteCount[a]
    const bValue = friendLookup[mp.mpId].similiarMpVoteCount[b]

    return bValue - aValue
  })
  const bestFriends = sortedFriendIds.slice(0, 5)
  friendLookup[mp.mpId].bestFriends = bestFriends.map(mpId => {
    const numberOfSimilarVotes = friendLookup[mp.mpId].similiarMpVoteCount[mpId]

    return `${nameLookup[mpId]}: ${numberOfSimilarVotes}`
  })

  const enemies = sortedFriendIds.slice(sortedFriendIds.length - 6, sortedFriendIds.length)
  friendLookup[mp.mpId].enemies = enemies.map(mpId => {
    const numberOfSimilarVotes = friendLookup[mp.mpId].similiarMpVoteCount[mpId]

    return `${nameLookup[mpId]}: ${numberOfSimilarVotes}`
  })
})

writeToFile(friendLookup, 'data/friend-lookup.json', true)
