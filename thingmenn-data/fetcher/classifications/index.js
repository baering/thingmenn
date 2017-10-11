import { fetchXml } from '../../utility/xml'

import { writeToFile } from '../../utility/file'

import {
  urlForClassifications,
} from '../urls'

function parseWordsInClassification(classificationTitleAttribute) {
  const words = classificationTitleAttribute.replace('þ.m.t. ', '')
  if (words.length) {
    return words.split(', ')
  }
  return []
}

function parseClassifications(xml) {
  const sections = []
  const subjects = []

  xml.efnisflokkar.yfirflokkur.forEach(section => {
    sections.push({
      id: section.$.id,
      name: section.heiti[0],
    })

    section.efnisflokkur.forEach(classification => {
      subjects.push({
        id: classification.$.id,
        name: classification.heiti[0],
        tags: parseWordsInClassification(classification.lýsing[0]),
      })
    })
  })

  return {
    sections,
    subjects,
  }
}

async function fetchClassifications() {
  const url = urlForClassifications()
  const xml = await fetchXml(url)
  return parseClassifications(xml)
}

async function fetch() {
  const classifications = await fetchClassifications()

  writeToFile(classifications, 'data/export-v2/classifications.json', true)
}

export default fetch
