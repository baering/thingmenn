import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'

const speechListUrl = 'http://www.althingi.is/altext/cv/is/raedur/?lthing=145'
const mpSpeechesUrl = 'http://www.althingi.is/altext/cv/is/raedur/?lthing=145&nfaerslunr='

function parseSpeech(html) {
  const htmlObj = cheerio.load(html)
  return htmlObj('#raeda_efni').text().trim()
}

async function fetchSpeech(url) {
  const html = await fetchHtml(url)
  return parseSpeech(html)
}

async function fetchMpSpeeches(speechUrls) {
  const speeches = []

  let counter = 0
  for (const speechUrl of speechUrls) {
    console.log(`\t- speech ${counter + 1} / ${speechUrls.length}`)
    const speech = await fetchSpeech(speechUrl)
    speeches.push(speech)
    counter++
  }

  return speeches
}

function parseMpSpeechUrls(html) {
  const urls = []
  const htmlObj = cheerio.load(html)

  const rows = htmlObj('.article > .boxbody li a')
  rows.each(function parseMpSpeechRow() {
    const element = htmlObj(this)

    const href = element.attr('href')
    urls.push(`http://www.althingi.is${href}`)
  })

  return urls
}

async function fetchMpSpeechUrls(mpId) {
  const url = `${mpSpeechesUrl}${mpId}`
  const html = await fetchHtml(url)
  const speechUrls = parseMpSpeechUrls(html)

  return speechUrls
}

async function fetchSpeeches(mpIds) {
  const mpSpeeches = []

  let counter = 0
  for (const mpId of mpIds) {
    console.log(`Fetching speeches for mp ${counter + 1} / ${mpIds.length}`)
    const speechUrls = await fetchMpSpeechUrls(mpId)
    const speeches = await fetchMpSpeeches(speechUrls)
    console.log('Done\n-------')

    mpSpeeches.push({
      mpId,
      speeches,
    })
    counter++
  }

  return mpSpeeches
}

async function parseMpIds(html) {
  const htmlObj = cheerio.load(html)
  const mpRows = htmlObj('.article > .boxbody li > a')

  const ids = []
  mpRows.each(function parseIdInRow() {
    const element = htmlObj(this)

    ids.push(element.attr('href').split('=')[1].split('&')[0])
  })

  return ids
}

async function fetchMpIds() {
  const html = await fetchHtml(speechListUrl)
  return parseMpIds(html)
}

async function fetchSpeechesFromAllMps() {
  const mpIds = await fetchMpIds()
  const mpSpeeches = await fetchSpeeches(mpIds)
  return mpSpeeches
}

export default fetchSpeechesFromAllMps
