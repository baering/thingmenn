import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'
import { writeToFile } from '../../utility/file'

const mpListUrl = 'http://www.althingi.is/altext/cv/is/atkvaedaskra/'
const mpDetailsUrl = 'http://www.althingi.is/altext/cv/is/?nfaerslunr='

function parseMpParty(htmlObj) {
  if (htmlObj('.office').length) {
    const parts = htmlObj('.office li:contains("Þingflokkur")')
    parts.children().remove()
    return parts.text().trim()
  }

  const description = htmlObj('.person p').text()

  if (description.length > 0) {
    return description.split('(')[1].split(')')[0]
  }
  return 'Tókst ekki að sækja'
}

function parseMpDetails(html, mpId) {
  const htmlObj = cheerio.load(html)

  return {
    id: mpId,
    name: htmlObj('h1').text(),
    party: parseMpParty(htmlObj),
    imagePath: `http://www.althingi.is${htmlObj('.person img').attr('src')}`,
    isPrimary: htmlObj('.office').length > 0,
  }
}

async function fetchMpDetails(mpId) {
  const url = `${mpDetailsUrl}${mpId}`
  const html = await fetchHtml(url)
  return parseMpDetails(html, mpId)
}

function parseMpIds(html) {
  const htmlObj = cheerio.load(html)

  const rows = htmlObj('.article .boxbody > ul li a')
  const mpIds = []
  rows.each(function parseMpRow() {
    const element = htmlObj(this)

    // ?nfaerslunr=MP_ID&lthing=LTHING_ID
    const href = element.attr('href')
    mpIds.push(href.split('nfaerslunr=')[1].split('&lthing=')[0])
  })

  return mpIds
}

async function fetchMpList(lthing) {
  const url = `${mpListUrl}?lthing=${lthing}`
  const html = await fetchHtml(url)

  const mpIds = parseMpIds(html)
  const mps = []
  for (let i = 0; i < mpIds.length; i++) {
    const mpId = mpIds[i]

    const mp = await fetchMpDetails(mpId)
    mps.push(mp)
  }

  return mps
}

async function fetch(lthing = 145) {
  try {
    console.log('Fetching mps')
    const mps = await fetchMpList(lthing)
    console.log('Done\n\nExample:')
    console.log(mps[0])
    writeToFile(mps, 'data/export/mps.json', true)
    return mps
  } catch (e) {
    console.log(`Error: ${e}`)
    return []
  }
}

export default fetch
