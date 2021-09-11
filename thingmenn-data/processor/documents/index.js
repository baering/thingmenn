import { loadFile, writeToFile } from '../../utility/file'

import {
  generateMpDocumentSummaries,
  generatePartyDocumentSummaries,
} from './helpers'

export default function process() {
  const documents = loadFile('data/v2/documents.json')

  const { mpDocumentsByLthing, mpDocumentsTotal } =
    generateMpDocumentSummaries(documents)

  writeToFile(
    mpDocumentsByLthing,
    'data/export-v2/by-lthing/mp-document-summaries.json',
    true,
  )
  writeToFile(
    mpDocumentsTotal,
    'data/export-v2/total/mp-document-summaries.json',
    true,
  )

  const { partyDocumentsByLthing, partyDocumentsTotal } =
    generatePartyDocumentSummaries(mpDocumentsByLthing, mpDocumentsTotal)

  writeToFile(
    partyDocumentsByLthing,
    'data/export-v2/by-lthing/party-document-summaries.json',
    true,
  )
  writeToFile(
    partyDocumentsTotal,
    'data/export-v2/total/party-document-summaries.json',
    true,
  )
}
