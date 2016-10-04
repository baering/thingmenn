import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'

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

      const topic = row.find('a').text()
      row.find('h3').remove()
      currentTopic = {
        topic,
        description: row.text().replace('\r\n', ''),
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

async function fetchVotesForMp(id) {
  const url = `${mpVoteUrl}${id}`
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

async function fetchMpVotes(ids) {
  const result = []

  for (const id of ids) {
    const votes = await fetchVotesForMp(id)
    result.push(votes)
  }

  return result
}

async function parseMpIds(html) {
  const htmlObj = cheerio.load(html)
  const mpRows = htmlObj('#t_thingmenn a')

  const ids = []
  for (let i = 0; i < mpRows.length; i++) {
    ids.push(mpRows[i].attribs.href.split('=')[1])
  }

  return ids
}

async function fetchMpIds() {
  const html = await fetchHtml(mpListUrl)
  return parseMpIds(html)
}

async function fetchData() {
  const mpIds = await fetchMpIds()
  const allVotes = await fetchMpVotes(mpIds)
  return allVotes
}

export default fetchData
