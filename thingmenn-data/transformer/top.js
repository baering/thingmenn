import { loadFile, writeToFile } from '../utility/file'
import { EXPORT_PATH } from './constants'

export function createTopListFileTransformer() {
  // Top attendance
  const mpTopAttendenceByLthing = loadFile(
    'data/export-v2/by-lthing/mp-top-attendance.json',
  )
  // const mpTopAttendenceByTerm = loadFile('data/export-v2/totals/mp-top-attendance.json')

  for (const lthing of Object.keys(mpTopAttendenceByLthing)) {
    const mpTopAttendenceForLthing = mpTopAttendenceByLthing[lthing]
    writeToFile(
      mpTopAttendenceForLthing,
      `${EXPORT_PATH}/mps/${lthing}/top-attendance.json`,
    )
  }

  // TODO for term
  // use export-v2/total/mp-vote-summaries.json to  calculate attendance

  // Top attendance
  // const mpTopAttendenceByTerm = loadFile('data/export-v2/totals/mp-top-attendance.json')

  for (const lthing of Object.keys(mpTopAttendenceByLthing)) {
    const mpBottomAttendenceForLthing = JSON.parse(
      JSON.stringify(mpTopAttendenceByLthing[lthing]),
    ).reverse()
    writeToFile(
      mpBottomAttendenceForLthing,
      `${EXPORT_PATH}/mps/${lthing}/bottom-attendance.json`,
    )
  }

  // TODO for term

  // Top stands taken
  const mpTopStandsTakenByLthing = loadFile(
    'data/export-v2/by-lthing/mp-top-stands-taken.json',
  )
  // TODO
  // const mpTopStandsTakenByTerm = loadFile('data/export-v2/totals/mp-top-stands-taken.json')

  for (const lthing of Object.keys(mpTopStandsTakenByLthing)) {
    const mpTopStandsTakenForLthing = mpTopStandsTakenByLthing[lthing]
    writeToFile(
      mpTopStandsTakenForLthing,
      `${EXPORT_PATH}/mps/${lthing}/top-stands-taken.json`,
    )
  }

  // TODO for term

  // Bottom stands taken
  for (const lthing of Object.keys(mpTopStandsTakenByLthing)) {
    const mpBottomStandsTakenForLthing = JSON.parse(
      JSON.stringify(mpTopStandsTakenByLthing[lthing]),
    ).reverse()
    writeToFile(
      mpBottomStandsTakenForLthing,
      `${EXPORT_PATH}/mps/${lthing}/bottom-stands-taken.json`,
    )
  }

  // TODO for term

  // Top minutes talked
  const mpTopMinutesTalkedByLthing = loadFile(
    'data/export-v2/by-lthing/mp-top-minutes-talked.json',
  )
  // TODO
  // const mpTopMinutesTalkedByTerm = loadFile('data/export-v2/totals/mp-top-minutes-talked.json')

  for (const lthing of Object.keys(mpTopMinutesTalkedByLthing)) {
    const mpTopMinutesTalkedForLthing = mpTopMinutesTalkedByLthing[lthing]
    writeToFile(
      mpTopMinutesTalkedForLthing,
      `${EXPORT_PATH}/mps/${lthing}/top-minutes-talked.json`,
    )
  }

  // Bottom minutes talked
  for (const lthing of Object.keys(mpTopMinutesTalkedByLthing)) {
    const mpBottomMinutesTalkedForLthing = JSON.parse(
      JSON.stringify(mpTopMinutesTalkedByLthing[lthing]),
    ).reverse()
    writeToFile(
      mpBottomMinutesTalkedForLthing,
      `${EXPORT_PATH}/mps/${lthing}/bottom-minutes-talked.json`,
    )
  }

  // TODO for term
}
