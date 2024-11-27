export const dataPath = 'https://storage.googleapis.com/thingmenn-data'
export const defaultPeriodId = '2021-2024'
export const defaultLthingId = '155'
export const releaseId = process.env.REACT_APP_RELEASE_ID
export const releaseIdHuman = new Date(Number(releaseId))
  .toISOString()
  .split('T')[0]
