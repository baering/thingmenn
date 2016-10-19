import fetchVotes from './votes'
import fetchSpeeches from './speeches'
import { writeToFile } from '../utility/file'

// fetchVotes()
//   .then(data => {
//     console.log('Successfully fetched votes')
//     writeToFile(data, 'data/all-votes-for-term.json')
//   }).catch(error => {
//     console.log(`There was an error: ${error}`)
//   })

fetchSpeeches().then(speeches => {
  console.log('Successfully fetched all speeches')
  writeToFile(speeches, 'data/term/speeches-for-term.json')
  }).catch((error) => console.log(`There was an error: ${error}`))

// import fetchMps from './mps'
//
// fetchMps()
//   .then(mps => {
//     console.log('Success')
//   })

// import fetchSubjects from './subjects'
//
// fetchSubjects()
//   .then(wasASuccess => {
//     console.log('Done', wasASuccess)
//   }).catch(error => console.log(`Error: ${error}`))
