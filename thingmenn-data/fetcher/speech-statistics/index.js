import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'
import { loadFile, writeToFile } from '../../utility/file'
import fetchMps from '../mps'

const baseUrl = 'http://www.althingi.is/thingstorf/raedur/raedur-thingmanna-eftir-thingum/?'

function generateUrlForMp(mpId, lthing) {
  return `${baseUrl}nfaerslunr=${mpId}&lthing=${lthing}`
}

function parseSpeechAnalyticsRow(row, summary) {
  const children = row.children()

  const label = row.find('td:first-child').text()
  const count = parseInt(row.find('td:nth-child(2)').text(), 10)
  const minutes = parseFloat(row.find('td:last-child').text().replace(',', '.'))

  summary[label] = {
    count,
    minutes,
  }
}

function parseMpSpeechAnalytics(htmlObj) {
  const infoTableRows = htmlObj('h2:contains("Yfirlit yfir") table tbody tr')

  const summary = {}
  infoTableRows.each(function parseRow() {
    const row = htmlObj(this)
    parseSpeechAnalyticsRow(row, summary)
  })
  return summary
}

async function fetchMpSpeechAnalytics(mpId, lthing = 145) {
  const url = generateUrlForMp(mpId, lthing)
  const html = await fetchHtml(url)
  const htmlObj = cheerio.load(html)

  try {
    return parseMpSpeechAnalytics(htmlObj)
  } catch (error) {
    console.log(`Error while parsing: ${error}`)
  }
}

async function fetchAllSpeechAnalytics(mps, lthings) {
  const statistics = {}
  for (const lthing of lthings) {
    console.log(`Fetching lthing ${lthing}`)
    statistics[lthing] = {}
    for (const mp of mps) {
      console.log(`MP: ${mp.name}`)
      statistics[lthing][mp.id] = await fetchMpSpeechAnalytics(mp.id, lthing)
    }
  }
  return statistics
}

async function getMps(lthing) {
  let mps = loadFile('data/mps.json')
  if (mps !== null) {
    return mps
  }

  mps = await fetchMps(lthing)
  return mps
}

export default async function fetch() {
  const lthings = [143, 144, 145]
  const mps = await getMps(lthings[lthings.length - 1])

  const statistics = await fetchAllSpeechAnalytics(mps, lthings)
  writeToFile(statistics, 'data/term/mp-speech-statistics.json', true)
  return statistics
}

// export default async function testFetch() {
//   const statistics = await fetchMpSpeechAnalytics(678, 145)
//   console.log(statistics)
// }
