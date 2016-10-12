import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'

import fetchMps from '../mps'
import { loadFile } from '../../utility/file'

const mpListUrl = 'http://www.althingi.is/thingmenn/althingismenn/'
const mpVoteUrl = 'http://www.althingi.is/altext/cv/is/atkvaedaskra/?nfaerslunr='

function parseMpVotes(html) {
  const result = []
  const htmlObj = cheerio.load(html)

  const rows = htmlObj('.boxbody > table tr')

  let currentTopic = null
  rows.each(function parseRow() {
    const row = htmlObj(this)
    if (row.children().length === 1) {
      if (currentTopic !== null) {
        result.push(currentTopic)
      }

      const topicAnchor = row.find('a')
      const topic = topicAnchor.text()
      row.find('h3').remove()
      currentTopic = {
        id: topicAnchor.attr('href').split('?')[1],
        votes: [],
      }
    } else {
      const cells = row.text().split('\r\n')

      currentTopic.votes.push({
        date: cells[1],
        proposal: cells[2],
        proposalUrl: row.find('a').attr('href'),
        vote: cells[3],
      })
    }
  })

  if (currentTopic !== null) {
    result.push(currentTopic)
  }

  return {
    mpName: htmlObj('.boxhead a').text(),
    votes: result,
  }
}

async function fetchVotesForMp(id, lthing = 145) {
  const url = `${mpVoteUrl}${id}&lthing=${lthing}`
  console.log(`About to fetch votes for: ${id}`)
  const html = await fetchHtml(url)
  const votes = parseMpVotes(html)
  console.log('Done\n-------')

  return {
    mpId: id,
    mpName: votes.mpName,
    votes: votes.votes,
  }
}

async function fetchMpVotes(ids, lthing) {
  const result = []

  for (const id of ids) {
    const votes = await fetchVotesForMp(id, lthing)
    result.push(votes)
  }

  return result
}

async function getMps(lthing) {
  let mps = loadFile('data/mps.json')
  if (mps !== null) {
    return mps
  }

  mps = await fetchMps(lthing)
  return mps
}

async function fetchData() {
  const mps = await getMps()
  const mpIds = mps.map(mp => mp.id)
  const lthings = [143, 144, 145]
  const allVotes = []

  for (const lthing of lthings) {
    console.log(`Fetching all votes from lthing: ${lthing}`)
    const allVotesOnLthing = await fetchMpVotes(mpIds, lthing)
    allVotes.push({
      lthing,
      votes: allVotesOnLthing,
    })
    console.log('Done..\n')
  }

  // const allVotes = await fetchMpVotes(mpIds)
  console.log('Fetched votes, example: ')
  console.log(allVotes[0].votes[0])
  return allVotes
}

export default fetchData
