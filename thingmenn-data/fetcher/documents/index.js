import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import { urlForDocuments, urlForDocumentDetails } from '../urls'
import { fetchExistingData } from '../utils'

// Read more here:
// http://www.althingi.is/thingstorf/ymsar-leidbeiningar/um-skjol-og-raedur/

function parsePresentersNormally(presenters) {
  if (presenters[0].flutningsmaður.length > 1) {
    return presenters[0].flutningsmaður.map((presenter) => ({
      id: parseInt(presenter.$.id, 10),
    }))
  }

  return presenters.map((presenter) => ({
    id: parseInt(presenter.flutningsmaður[0].$.id, 10),
  }))
}

function parsePresentersAsAComittee(presenters) {
  const comittee = presenters[0].nefnd[0]
  return comittee.flutningsmaður.map((presenter) => {
    let id = presenter.id
    if (id === undefined) {
      id = presenter.$.id
    }

    return {
      id: parseInt(id, 10),
    }
  })
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

  const caseId = xml.þingskjal.málalisti[0].mál[0].$.málsnúmer

  return {
    id: documentId,
    lthing,
    issuedAt: documentInfo.útbýting[0],
    type: documentInfo.skjalategund[0],
    presenters,
    caseId: parseInt(caseId, 10),
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

  const resultFile = 'data/v2/documents.json'
  const existingData = fetchExistingData(resultFile, lthings, {
    resetCurrentLthings: true,
  })

  const documentsByLthing = existingData || {}

  for (const lthing of lthings) {
    const documents = await fetchDocumentsForLthing(lthing)

    documentsByLthing[lthing] = documents
  }

  writeToFile(documentsByLthing, 'data/v2/documents.json', true)
}

export default fetch
