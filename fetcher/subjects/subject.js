import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'

const subjectRootUrl = 'http://www.althingi.is/thingstorf/leit-ad-thingmalum/efnisyfirlit/millivisanir'

// Used to find subject words
const subjectPrefix = '/thingstorf/listar-yfir-mal-a-yfirstandandi-thingi/thingmal-eftir-efnisflokkum/?efnisflokkur='

// Used to find more specific words related to a subject word
const tagPrefix = '/thingstorf/leit-ad-thingmalum/efnisyfirlit/?ltg='

function generateUrl(lthing, column, subjectId) {
  return `${subjectRootUrl}?ltg=${lthing}&mfl=${column}&mnr=${subjectId}`
}

function parseSubjectWords(html) {
  const htmlObj = cheerio.load(html)

  const subjectWordLinks = htmlObj(`a[href*="${subjectPrefix}"]`)
  const subjects = []
  subjectWordLinks.each(function parseLink() {
    const element = htmlObj(this)
    subjects.push(element.text())
  })

  const subjectTagLinks = htmlObj(`a[href*="${tagPrefix}"]`)
  const tags = []
  subjectTagLinks.each(function parseTagLink() {
    const element = htmlObj(this)
    tags.push(element.text())
  })

  return {
    subjects,
    tags,
  }
}

async function fetchSubjectWords(lthing, column, subjectId) {
  const url = generateUrl(lthing, column, subjectId)
  const html = await fetchHtml(url)
  return parseSubjectWords(html)
}

async function fetch(lthing, column, subjectId) {
  try {
    const words = await fetchSubjectWords(lthing, column, subjectId)
    console.log(words)
    return words
  } catch (e) {
    return []
  }
}

export default fetch