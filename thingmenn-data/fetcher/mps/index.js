import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'
import { writeToFile } from '../../utility/file'

const mpListUrl = 'http://www.althingi.is/altext/cv/is/atkvaedaskra/'
const mpDetailsUrl = 'http://www.althingi.is/altext/cv/is/?nfaerslunr='

const letters = 'abcdefghijklmnoprstuvwxyz'

const icelandicLetterToAscii = {
  á: 'a',
  ð: 'd',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ý: 'y',
  þ: 'th',
  æ: 'ae',
  ö: 'o',
}

const partyNameToSlug = {
  'Björt framtíð': 'bjort-framtid',
  Framsóknarflokkur: 'framsoknarflokkur',
  Píratar: 'piratar',
  Samfylkingin: 'samfylkingin',
  Sjálfstæðisflokkur: 'sjalfstaedisflokkur',
  'Vinstri hreyfingin – grænt framboð': 'vinstri-hreyfingin-graent-frambod',
}

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

function parseMpDescription(htmlObj) {
  const description = htmlObj('h3:contains("Þingseta")').next()
  if (description.length) {
    return description.text()
  }
  return ''
}

function isSubstitute(htmlObj) {
  // TODO: This is fine for now, only one term
  // But in future, refactor to use xml service
  // http://www.althingi.is/altext/xml/thingmenn/thingmadur/thingseta/?nr=mpId
  // <þing>145</þing>
  return htmlObj('.person').text().indexOf('Varaþingmaður') !== -1
}

function generateSlug(mpName) {
  const nameLowerCased = mpName.toLowerCase()
  return nameLowerCased.split('').map(letter => {
    if (letter === ' ') {
      return '_'
    }
    if (icelandicLetterToAscii[letter]) {
      return icelandicLetterToAscii[letter]
    }
    if (letters.indexOf(letter) !== -1) {
      return letter
    }
    return '\n'
  }).filter(letter => letter !== '\n')
  .join('')
}

function parseMpDetails(html, mpId) {
  const htmlObj = cheerio.load(html)

  const mpName = htmlObj('h1').text()
  const slug = generateSlug(mpName)
  const partyName = parseMpParty(htmlObj)
  return {
    id: mpId,
    name: mpName,
    slug,
    party: partyName,
    partySlug: partyNameToSlug[partyName],
    imagePath: `http://www.althingi.is${htmlObj('.person img').attr('src')}`,
    isSubstitute: isSubstitute(htmlObj),
    description: parseMpDescription(htmlObj),
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

async function fetchMpList(lthing, mpLookup) {
  const url = `${mpListUrl}?lthing=${lthing}`
  const html = await fetchHtml(url)

  const mpIds = parseMpIds(html)
  const mps = []
  for (let i = 0; i < mpIds.length; i++) {
    const mpId = mpIds[i]

    if (!mpLookup[mpId]) {
      console.log(`Fetching mp ${mpId}`)
      const mp = await fetchMpDetails(mpId)
      mps.push(mp)
    }
  }

  return mps
}

async function fetch() {
  const lthings = [145, 144, 143]
  try {
    const mpLookup = {}
    for (const lthing of lthings) {
      console.log(`Fetching from lthing ${lthing}`)
      const mpsForLthing = await fetchMpList(lthing, mpLookup)
      console.log('Done')
      mpsForLthing.forEach(mp => {
        if (!mpLookup[mp.id]) {
          mpLookup[mp.id] = mp
        }
      })
    }
    const mpIds = Object.keys(mpLookup)
    const mps = mpIds.map(mpId => mpLookup[mpId])

    console.log('All done\n\nExample:')
    console.log(mps[0])
    writeToFile(mps, 'data/export/mps.json', true)

    return mps
  } catch (e) {
    console.log(`Error: ${e}`)
    return []
  }
}

async function testFetch() {
  const mp = await fetchMpDetails(656)
  console.log(mp)
}

export default fetch
