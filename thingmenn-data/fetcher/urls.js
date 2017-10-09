export function urlForMpsInLthing(lthing) {
  if (isNaN(lthing)) {
    throw new Error('lthing is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/?lthing=${lthing}`
}

export function urlForMpLthings(mpId) {
  if (isNaN(mpId)) {
    throw new Error('mpId is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/thingmadur/thingseta/?nr=${mpId}`
}

export function urlForMpHistory(mpId) {
  if (isNaN(mpId)) {
    throw new Error('mpId is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/thingmadur/lifshlaup/?nr=${mpId}`
}

export function urlForLthingVoting(lthing) {
  if (isNaN(lthing)) {
    throw new Error('lthing is not a number')
  }

  return `http://www.althingi.is/altext/xml/atkvaedagreidslur/?lthing=${lthing}`
}

export function urlForVotes(votingId) {
  if (isNaN(votingId)) {
    throw new Error('votingId is not a number')
  }

  return `http://www.althingi.is/altext/xml/atkvaedagreidslur/atkvaedagreidsla/?numer=${votingId}`
}
