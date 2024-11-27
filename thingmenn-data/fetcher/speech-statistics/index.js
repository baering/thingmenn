import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'
import { loadFile, writeToFile } from '../../utility/file'
import { fetchExistingData } from '../utils'

const baseUrl =
  'http://www.althingi.is/thingstorf/raedur/raedur-thingmanna-eftir-thingum/?'

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

function parseMpSpeechAnalytics(
  htmlObj,
  infoTableRowsSelector = 'div > table tbody tr',
) {
  const tableHeadingSelector = 'h2:contains("Yfirlit yfir")'
  const infoTableRows = htmlObj(
    `${tableHeadingSelector} + ${infoTableRowsSelector}`,
  )

  const summary = {}
  infoTableRows.each(function parseRow() {
    const row = htmlObj(this)
    parseSpeechAnalyticsRow(row, summary)
  })

  if (Object.keys(summary).length === 0) {
    return parseMpSpeechAnalytics(htmlObj, 'table tbody tr')
  }
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

async function fetchAllSpeechAnalytics(mpsByLthings, lthings, existingData) {
  const statistics = existingData || {}
  for (const lthing of lthings) {
    statistics[lthing] = {}
    const mpsInLthing = mpsByLthings[lthing]
    for (const mp of mpsInLthing) {
      const data = await fetchMpSpeechAnalytics(mp.id, lthing)
      statistics[lthing][mp.id] = data
    }
  }
  return statistics
}

export default async function fetch(lthings) {
  const mpsByLthings = loadFile('data/v2/mps-by-lthing.json')
  const resultFile = 'data/v2/mp-speech-statistics.json'
  const existingData = fetchExistingData(resultFile, lthings, {
    resetCurrentLthings: true,
  })

  const statistics = await fetchAllSpeechAnalytics(
    mpsByLthings,
    lthings,
    existingData,
  )
  writeToFile(statistics, resultFile, true)
  return statistics
}
