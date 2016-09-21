import fetchVotes from './votes'
import fetchSpeeches from './speeches'
import { writeToFile } from '../utility/file'

// fetchVotes()
//   .then(data => {
//     console.log('Successfully fetched votes')
//     writeToFile(data, 'data/all-votes.json')
//   }).catch(error => {
//     console.log(`There was an error: ${error}`)
//   })

// fetchSpeeches().then(speeches => {
//   console.log('Successfully fetched all speeches')
//   writeToFile(speeches, 'data/all-speeches-.json')
//   }).catch((error) => console.log(`There was an error: ${error}`))
