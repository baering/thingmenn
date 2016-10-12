import cheerio from 'cheerio'
import { fetchHtml } from '../../utility/html'

import fetchMps from '../mps'
import { loadFile, writeToFile } from '../../utility/file'
import fetchSubjectWords from './subject'

const mpVoteUrl = 'http://www.althingi.is/altext/cv/is/atkvaedaskra/?nfaerslunr=652&lthing=143'
const subjectContainMap = {}

function parseSubjectWordInfo(raw) {
  // ltg=LTHING&mfl=COLUMN&mnr=SUBJECT_ID
  const parts = raw.split('&')
  return {
    lthing: parts[0].split('=')[1],
    column: parts[1].split('=')[1],
    subjectId: parts[2].split('=')[1],
  }
}

function processSubjectWords(subjects) {
  subjects.forEach(subject => {
    if (!subjectContainMap[subject.name]) {
      subjectContainMap[subject.name] = {}
    }

    if (subject.words) {
      subject.words.forEach(word => subjectContainMap[subject.name][word] = true)
    }
  })
}

async function fetchWordsForSubject(subject, lthing) {
  const html = await fetchHtml(`http://www.althingi.is/thingstorf/thingmalalistar-eftir-thingum/ferill/?${subject.id}`)
  const rawSubjectInfo = html.split('/thingstorf/leit-ad-thingmalum/efnisyfirlit/millivisanir?')[1].split('"')[0]
  const parsedSubjectInfo = parseSubjectWordInfo(rawSubjectInfo)
  const words = await fetchSubjectWords(lthing, parsedSubjectInfo.column, parsedSubjectInfo.subjectId)

  if (words.subjects) {
    processSubjectWords(words.subjects)
  }

  subject.words = {
    subjects: words.subjects ? words.subjects.map(currentSubject => currentSubject.name) : undefined,
    tags: words.tags,
  }
}

function parseSubjects(html) {
  const htmlObj = cheerio.load(html)
  const rows = htmlObj('.boxbody > table tr')

  const subjects = []
  rows.each(function parseRow() {
    const row = htmlObj(this)
    if (row.children().length === 1) {
      const subjectAnchor = row.find('a')
      const subjectId = subjectAnchor.attr('href').split('?')[1]
      const subjectTitle = subjectAnchor.text()
      row.find('h3').remove()
      const subjectDescription = row.text().replace('\r\n', '')

      subjects.push({
        id: subjectId,
        title: subjectTitle,
        description: subjectDescription,
      })
    }
  })

  return subjects
}

function generateMpVoteListUrl(mpId, lthing) {
  return `http://www.althingi.is/altext/cv/is/atkvaedaskra/?nfaerslunr=${mpId}&lthing=${lthing}`
}

async function fetchSubjectsForMp(mpId, lthing, allSubjects) {
  const url = generateMpVoteListUrl(mpId, lthing)

  const html = await fetchHtml(url)
  const subjects = parseSubjects(html)

  for (const subject of subjects) {
    if (!allSubjects[subject.id]) {
      console.log(`Fetching subject: ${subject.title}`)
      await fetchWordsForSubject(subject, lthing)
      allSubjects[subject.id] = subject
    }
  }
}

async function getMps(lthing) {
  let mps = loadFile('data/mps.json')
  if (mps !== null) {
    return mps
  }

  mps = await fetchMps(lthing)
  return mps
}

async function fetchAllSubjects(lthing) {
  console.log('Starting to fetch all subjects')

  console.log('Begin by fetching mps')
  const mps = await getMps(lthing)
  console.log('Done ..')

  const subjects = {}
  let counter = 0
  for (const mp of mps) {
    console.log(`Fetching subjects for mp ${counter} / ${mps.length}`)
    try {
      await fetchSubjectsForMp(mp.id, lthing, subjects)
    } catch (error) {
      console.log(`Failed: ${error}`)
      break
    }
    ++counter
  }
  console.log('Done')
  console.log(Object.keys(subjects))

  writeToFile(subjects, 'data/subjects.json', true)

  const subjectContainResult = []
  Object.keys(subjectContainMap).forEach(subjectName => {
    subjectContainResult.push({
      subject: subjectName,
      wordsInSubject: Object.keys(subjectContainMap[subjectName]),
    })
  })
  writeToFile(subjectContainResult, 'data/subjects-contain.json', true)
  return true
}

export default fetchAllSubjects
