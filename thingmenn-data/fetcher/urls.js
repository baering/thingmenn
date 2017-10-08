export function urlForMpsInLthing(lthing) {
  if (isNaN(lthing)) {
    throw new Error('lthing is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/?lthing=${lthing}`
}

export function urlForMpLthings(mpId) {
  if (isNaN(mpId)) {
    throw new Error('mp id is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/thingmadur/thingseta/?nr=${mpId}`
}

export function urlForMpHistory(mpId) {
  if (isNaN(mpId)) {
    throw new Error('mp id is not a number')
  }

  return `http://www.althingi.is/altext/xml/thingmenn/thingmadur/lifshlaup/?nr=${mpId}`
}
