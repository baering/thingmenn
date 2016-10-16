import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'
import { loadFile, writeToFile } from '../../utility/file'
import fetchMps from '../mps'

const mpSpeechesUrl = 'http://www.althingi.is/altext/cv/is/raedur/?'

function parseSpeech(html) {
  const htmlObj = cheerio.load(html)
  return htmlObj('#raeda_efni').text().trim()
}

async function fetchSpeech(url) {
  try {
    const html = await fetchHtml(url)
    return parseSpeech(html)
  } catch (error) {
    console.log(`Error fetching speech: ${url}`)
    return null
  }
}

async function fetchMpSpeeches(speechUrls) {
  const speeches = []

  let counter = 0
  for (const speechUrl of speechUrls) {
    console.log(`\t- speech ${counter + 1} / ${speechUrls.length}`)
    try {
      const speech = await fetchSpeech(speechUrl)
      if (speech !== null) {
        speeches.push(speech)
      }
    } catch (error) {
      console.log(`Failed to fetch speech: ${error}`)
    }
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

async function fetchMpSpeechUrls(mpId, lthing = 145) {
  const url = `${mpSpeechesUrl}lthing=${lthing}&nfaerslunr=${mpId}`
  const html = await fetchHtml(url)
  const speechUrls = parseMpSpeechUrls(html)

  return speechUrls
}

async function fetchSpeeches(mps, lthings) {
  const mpSpeeches = []

  for (const lthing of lthings) {
    const lthingSpeeches = []
    console.log(`Fetching lthing: ${lthing}`)

    let counter = 0
    for (const mp of mps) {
      console.log(`Mp ${counter} / ${mps.length}`)
      try {
        const speechUrls = await fetchMpSpeechUrls(mp.id, lthing)
        const speeches = await fetchMpSpeeches(speechUrls)

        lthingSpeeches.push({
          mpId: mp.id,
          speeches,
        })
      } catch (error) {
        console.log(`Failed fetching for ${mp.id}, ${lthing}: ${error}`)
      }
      ++counter
    }

    console.log(`Lthing ${lthing} done`)
    try {
      writeToFile(lthingSpeeches, `data/term/speeches-${lthing}.json`)
    } catch (error) {
      console.log(`Could not ${lthing} write to file: ${error}`)
    }

    mpSpeeches.push({
      lthing,
      speeches: lthingSpeeches,
    })
  }

  return mpSpeeches
}

async function getMps(lthing) {
  let mps = loadFile('data/mps.json')
  if (mps !== null) {
    return mps
  }

  mps = await fetchMps(lthing)
  return mps
}

async function fetchSpeechesFromAllMps() {
  const lthings = [144, 145]
  const mps = await getMps(lthings[lthings.length - 1])
  const mpSpeeches = await fetchSpeeches(mps, lthings)
  return mpSpeeches
}

export default fetchSpeechesFromAllMps
