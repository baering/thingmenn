import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import {
  urlForMpsInLthing,
  urlForMpLthings,
  urlForMpHistory,
} from '../urls'

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
  return keys.reduce((description, key) => {
    const keyValue = mpHistory[key].trim()
    if (description.length > 0) {
      return `${description} ${keyValue}`
    }
    return keyValue
  }, '').trim()
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
    asPerson: formDescriptionFromKeys(history, ['education', 'career', 'social']),
    asMp: formDescriptionFromKeys(history, ['asSubstitudeMp', 'asMp', 'asMinister']),
  }
}

async function fetchMpHistory(mpId) {
  const url = urlForMpHistory(mpId)
  const xml = await fetchXml(url)
  return parseMpHistoryDetails(xml)
}

async function getMpDetails(xml, lthing) {
  const mpBaseInfo = parseMpXmlBaseInfo(xml, lthing)
  const mpLthingInfo = await fetchMpLthingInfo(mpBaseInfo.id, lthing)
  const mpHistory = await fetchMpHistory(mpBaseInfo.id)

  return { ...mpBaseInfo, lthings: [{ ...mpLthingInfo, lthing }], description: mpHistory }
}

async function fetch(lthings) {
  if (lthings.length === 0) {
    throw new Error('no lthings in fetcher/mps')
  }

  const mps = {}

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
        mps[details.id].lthings = mps[details.id].lthings.concat(details.lthings)
      }
    }
  }

  const mpIds = Object.keys(mps).map(mpId => parseInt(mpId, 10))

  const result = mpIds.map(mpId => mps[mpId])
  writeToFile(result, 'data/v2/mps.json', true)

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

  return result
}

export default fetch
