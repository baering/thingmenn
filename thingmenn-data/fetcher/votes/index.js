import { fetchXml } from '../../utility/xml'

import { writeToFile } from '../../utility/file'

import {
  urlForLthingVoting,
  urlForVotes,
} from '../urls'

function parseCasesFromVotings(votings) {
  const caseLookup = {}
  const cases = []

  for (const voting of votings) {
    const caseId = voting.$.málsnúmer
    if (!caseLookup[caseId]) {
      cases.push({
        id: voting.$.málsnúmer,
        category: voting.$.málsflokkur,
        lthing: voting.$.þingnúmer,
        name: voting.mál[0].málsheiti[0],
      })
      caseLookup[caseId] = true
    }
  }

  return cases
}

function formatVotings(votings) {
  return votings.map(voting => ({
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
  const xml = await fetchXml(url)
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

  const cases = parseCasesFromVotings(rawVotings)
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
  const xml = await fetchXml(url)
  return await parseLthingVotings(xml)
}

async function fetch(lthings) {
  if (!lthings) {
    throw new Error('no lthings in fetcher/votes')
  }

  const votings = {}
  for (const lthing of lthings) {
    const lthingVotings = await fetchVotingsForLthing(lthing)
    votings[lthing] = lthingVotings
  }

  writeToFile(votings, 'data/v2/votings.json', true)
}

export default fetch
