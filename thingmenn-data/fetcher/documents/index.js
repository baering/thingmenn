import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import {
  urlForDocuments,
  urlForDocumentDetails,
} from '../urls'

// Read more here:
// http://www.althingi.is/thingstorf/ymsar-leidbeiningar/um-skjol-og-raedur/

function parsePresentersNormally(presenters) {
  return presenters.map(presenter => ({
    id: parseInt(presenter.flutningsmaður[0].$.id, 10),
  }))
}

function parsePresentersAsAComittee(presenters) {
  const comittee = presenters[0].nefnd[0]
  return comittee.flutningsmaður.map(presenter => ({
    id: presenter.id,
  }))
}

function parsePresenters(xml) {
  try {
    return parsePresentersNormally(xml)
  } catch (e) {
    return parsePresentersAsAComittee(xml)
  }
}

function parseDocument(xml, lthing, documentId) {
  const documentInfo = xml.þingskjal.þingskjal[0]

  let presenters
  try {
    presenters = parsePresenters(documentInfo.flutningsmenn)
  } catch (e) {
    presenters = null
  }

  return {
    id: documentId,
    lthing,
    issuedAt: documentInfo.útbýting[0],
    type: documentInfo.skjalategund[0],
    presenters,
  }
}

async function fetchDocument(lthing, documentId) {
  const url = urlForDocumentDetails(lthing, documentId)
  const xml = await fetchXml(url)
  return parseDocument(xml, lthing, documentId)
}

async function getDocumentDetails(xml) {
  const documents = []

  for (const doc of xml.þingskjöl.þingskjal) {
    const { þingnúmer, skjalsnúmer } = doc.$
    const lthing = parseInt(þingnúmer, 10)
    const documentId = parseInt(skjalsnúmer, 10)
    const fullDocument = await fetchDocument(lthing, documentId)
    documents.push(fullDocument)
  }

  return documents
}

async function fetchDocumentsForLthing(lthing) {
  const url = urlForDocuments(lthing)
  const xml = await fetchXml(url)
  return getDocumentDetails(xml)
}

async function fetch(lthings) {
  if (!lthings) {
    throw new Error('missing lthings for document fetcher')
  }

  const documentsByLthing = {}

  for (const lthing of lthings) {
    const documents = await fetchDocumentsForLthing(lthing)

    documentsByLthing[lthing] = documents
  }

  writeToFile(documentsByLthing, 'data/v2/documents.json', true)
}

export default fetch
