import cheerio from 'cheerio'
import { fetchXml } from '../../utility/xml'
import { fetchHtml } from '../../utility/html'
import { writeToFile } from '../../utility/file'
import {
  urlForMpsInLthing,
  urlForMpLthings,
  urlForMpHistory,
  urlForMpPayments,
} from '../urls'
import { fetchExistingData } from '../utils'

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

// const partyNameToSlug = {
//   'Björt framtíð': 'bjort-framtid',
//   Framsóknarflokkur: 'framsoknarflokkur',
//   Píratar: 'piratar',
//   Samfylkingin: 'samfylkingin',
//   Sjálfstæðisflokkur: 'sjalfstaedisflokkur',
//   'Vinstri hreyfingin – grænt framboð': 'vinstri-hreyfingin-graent-frambod',
// }

function generateSlug(mpName) {
  const nameLowerCased = mpName.toLowerCase()
  return nameLowerCased
    .split('')
    .map((letter) => {
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
    })
    .filter((letter) => letter !== '\n')
    .join('')
}

function parseMpXmlBaseInfo(xml) {
  const mpId = parseInt(xml.$.id, 10)
  const mpName = xml.nafn[0]
  const slug = generateSlug(mpName)

  return {
    id: mpId,
    mpName,
    slug,
    imagePath: `http://www.althingi.is/myndir/thingmenn-cache/${mpId}/${mpId}-220.jpg`,
  }
}

function parseMpLthingXmlDetails(xml, lthing) {
  for (const currentLthingInfo of xml.þingmaður.þingsetur[0].þingseta) {
    const currentLthing = parseInt(currentLthingInfo.þing[0], 10)

    if (currentLthing === lthing) {
      return {
        partyId: parseInt(currentLthingInfo.þingflokkur[0].$.id, 10),
        isSubstitute: currentLthingInfo.tegund.indexOf('varamaður') !== -1,
        constituencyId: parseInt(currentLthingInfo.kjördæmi[0].$.id, 10),
      }
    }
  }

  return {}
}

async function fetchMpLthingInfo(mpId, lthing) {
  const url = urlForMpLthings(mpId)
  const xml = await fetchXml(url)
  return parseMpLthingXmlDetails(xml, lthing)
}

function formDescriptionFromKeys(mpHistory, keys) {
  return keys
    .reduce((description, key) => {
      const keyValue = mpHistory[key].trim()
      if (description.length > 0) {
        return `${description} ${keyValue}`
      }
      return keyValue
    }, '')
    .trim()
}

function parseMpHistoryDetails(xml) {
  const {
    menntun,
    starfsferill,
    félagsmál,
    þingmennska,
    varaþingmennska,
    ráðherra,
  } = xml.þingmaður.lífshlaup[0]

  const history = {
    education: menntun[0],
    career: starfsferill[0],
    social: félagsmál[0],
    asMp: þingmennska[0],
    asSubstitudeMp: varaþingmennska[0],
    asMinister: ráðherra[0],
  }

  return {
    asPerson: formDescriptionFromKeys(history, [
      'education',
      'career',
      'social',
    ]),
    asMp: formDescriptionFromKeys(history, [
      'asSubstitudeMp',
      'asMp',
      'asMinister',
    ]),
  }
}

async function fetchMpHistory(mpId) {
  const url = urlForMpHistory(mpId)
  const xml = await fetchXml(url)
  return parseMpHistoryDetails(xml)
}

function parseMpPayments(htmlObj) {
  const tableHeadingSelector = 'h2:contains("Yfirlit ")'

  const tableHeadYears = htmlObj(
    `${tableHeadingSelector} + div > table > thead th`,
  )
  const tableRows = htmlObj(
    `${tableHeadingSelector} + div > table > tbody > tr`,
  )

  const years = []
  tableHeadYears.each(function parseTableHeadYear() {
    const cell = htmlObj(this)
    const value = cell.text()

    if (typeof value === 'string' && value.length > 0) {
      years.push(parseFloat(value))
    }
  })

  const result = {
    categories: {},
    totalByYear: {},
    total: 0,
  }
  tableRows.each(function parseTableRow() {
    const row = htmlObj(this)

    const rowDescription = row.find('td:first-child').text()

    if (rowDescription.indexOf('samtals') === -1) {
      return
    }

    // If we get here we know this is a total row so we can
    // get the category value
    const [rawCategory] = rowDescription.split(' samtals')
    const category = rawCategory.trim()

    if (!result.categories[category]) {
      result.categories[category] = {
        totalByYear: {},
        total: 0,
      }
    }

    // All the other tds will contain values
    const paymentTds = row.find('td:not(:first-child)')

    // Current year is the first one
    let yearIndex = 0
    paymentTds.each(function parseTableTd() {
      const currentYear = years[yearIndex]
      const cell = htmlObj(this)

      // Remove all dots from the number
      const value = cell.text().replace(/\./g, '')

      const payment =
        typeof value === 'string' && value.length > 0 ? parseFloat(value) : 0

      if (!result.byYear[currentYear]) {
        result.byYear[currentYear] = 0
      }

      // Set the value for that year in the current category
      result.categories[category].byYear[currentYear] = payment
      // Along with raising the total
      result.categories[category].total += payment

      // Add the current payment to the total for the current year
      result.byYear[currentYear] += payment
      // As well as the grand total for all years
      result.total += payment

      yearIndex += 1
    })
  })

  return result
}

async function fetchMpPayments(mpId) {
  const url = urlForMpPayments(mpId)
  const html = await fetchHtml(url)
  const htmlObj = cheerio.load(html)
  return parseMpPayments(htmlObj)
}

async function getMpDetails(xml, lthing) {
  const mpBaseInfo = parseMpXmlBaseInfo(xml, lthing)
  const mpLthingInfo = await fetchMpLthingInfo(mpBaseInfo.id, lthing)
  const mpHistory = await fetchMpHistory(mpBaseInfo.id)

  return {
    ...mpBaseInfo,
    lthings: [{ ...mpLthingInfo, lthing }],
    description: mpHistory,
  }
}

async function fetch(lthings) {
  if (lthings.length === 0) {
    throw new Error('no lthings in fetcher/mps')
  }

  const resultFile = 'data/v2/mps.json'
  const existingData = fetchExistingData(resultFile, lthings)

  const mps = {}

  if (existingData) {
    existingData.forEach((mp) => {
      mps[mp.id] = mp
    })
  }

  for (const lthing of lthings) {
    const mpsUrl = urlForMpsInLthing(lthing)
    const mpsAsXml = await fetchXml(mpsUrl)

    for (const mp of mpsAsXml.þingmannalisti.þingmaður) {
      const details = await getMpDetails(mp, lthing)

      if (!mps[details.id]) {
        mps[details.id] = details
      } else {
        if (mps[details.id].lthings === undefined) {
          mps[details.id].lthings = []
        }
        // Always use the latest description
        mps[details.id].description = details.description

        mps[details.id].lthings = mps[details.id].lthings.concat(
          details.lthings,
        )
      }
    }
  }

  const mpIds = Object.keys(mps).map((mpId) => parseInt(mpId, 10))

  const result = mpIds.map((mpId) => {
    const mpData = {
      ...mps[mpId],
    }

    // Remove any duplicates should they exist
    mpData.lthings = mpData.lthings
      .reduce((unique, current) => {
        if (
          unique.find((existingItem) => existingItem.lthing === current.lthing)
        ) {
          return unique
        }

        unique.push(current)

        return unique
      }, [])
      .sort((a, b) => b.lthing - a.lthing)

    return mpData
  })

  writeToFile(result, resultFile, true)

  const mpsByLthing = {}
  for (const mp of result) {
    for (const lthingInfo of mp.lthings) {
      const { lthing, partyId } = lthingInfo
      if (mpsByLthing[lthing] === undefined) {
        mpsByLthing[lthing] = []
      }

      mpsByLthing[lthing].push({
        id: mp.id,
        partyId,
      })
    }
  }

  writeToFile(mpsByLthing, 'data/v2/mps-by-lthing.json', true)

  const paymentsByMp = {}

  for (const mp of result) {
    const payments = await fetchMpPayments(mp.id)

    paymentsByMp[mp.id] = payments
  }

  writeToFile(paymentsByMp, 'data/v2/payments-by-mp.json', true)

  return result
}

export default fetch
