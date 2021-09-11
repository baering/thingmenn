import { fetchXml } from '../../utility/xml'

import { writeToFile } from '../../utility/file'
import { fetchExistingData } from '../utils'

import { urlForLthingVoting, urlForVotes, urlForCase } from '../urls'

function getCase(caseId, lthing) {
  const url = urlForCase(caseId, lthing)
  return fetchXml(url)
}

async function getCaseClassification(caseId, lthing) {
  const xml = await getCase(caseId, lthing)

  const sectionIds = []
  const subjectIds = []

  xml.þingmál.efnisflokkar[0].yfirflokkur.forEach((section) => {
    sectionIds.push(parseInt(section.$.id, 10))
    section.efnisflokkur.forEach((subject) => {
      subjectIds.push(parseInt(subject.$.id, 10))
    })
  })

  return { sectionIds, subjectIds }
}

async function parseCasesFromVotings(votings) {
  const caseLookup = {}
  const cases = []

  for (const voting of votings) {
    const caseId = parseInt(voting.$.málsnúmer, 10)
    const lthing = parseInt(voting.$.þingnúmer, 10)
    if (!caseLookup[caseId]) {
      let classification = null
      try {
        classification = await getCaseClassification(caseId, lthing)
      } catch (e) {
        classification = { sectionIds: [], subjectIds: [] }
      }

      const newCase = {
        id: caseId,
        category: voting.$.málsflokkur,
        lthing,
        name: voting.mál[0].málsheiti[0],
        classification,
      }

      cases.push(newCase)
      caseLookup[caseId] = true
    }
  }

  return cases
}

function formatVotings(votings) {
  return votings.map((voting) => ({
    id: parseInt(voting.$.atkvæðagreiðslunúmer, 10),
    date: new Date(voting.tími[0]).getTime(),
  }))
}

let nextVoteId = 0

function parseVotes(xml) {
  try {
    return xml.atkvæðagreiðsla.atkvæðaskrá[0].þingmaður.map((mp) => ({
      id: nextVoteId++,
      mpId: parseInt(mp.$.id, 10),
      vote: mp.atkvæði[0],
      caseId: parseInt(xml.atkvæðagreiðsla.$.málsnúmer, 10),
      lthing: parseInt(xml.atkvæðagreiðsla.$.þingnúmer, 10),
      votingId: parseInt(xml.atkvæðagreiðsla.$.atkvæðagreiðslunúmer, 10),
    }))
  } catch (e) {
    return []
  }
}

async function fetchVotesFromVoting(votingId) {
  const url = urlForVotes(votingId)
  const xml = await fetchXml(url, false)
  return parseVotes(xml)
}

async function getVotesFromVotings(votings) {
  let votes = []
  for (const voting of votings) {
    votes = votes.concat(await fetchVotesFromVoting(voting.id))
  }
  return votes
}

async function parseLthingVotings(xml) {
  const rawVotings = xml.atkvæðagreiðslur.atkvæðagreiðsla

  const cases = await parseCasesFromVotings(rawVotings)
  const votings = formatVotings(rawVotings)
  const votes = await getVotesFromVotings(votings)

  return {
    cases,
    votings,
    votes,
  }
}

async function fetchVotingsForLthing(lthing) {
  const url = urlForLthingVoting(lthing)
  const xml = await fetchXml(url, false)
  return await parseLthingVotings(xml)
}

async function fetch(lthings) {
  if (!lthings) {
    throw new Error('no lthings in fetcher/votes')
  }

  const resultFile = 'data/v2/votings.json'
  const existingData = fetchExistingData(resultFile, lthings, {
    resetCurrentLthings: true,
  })

  const votings = existingData || {}
  for (const lthing of lthings) {
    const lthingVotings = await fetchVotingsForLthing(lthing)
    votings[lthing] = lthingVotings
  }

  writeToFile(votings, resultFile, true)
}

export default fetch
