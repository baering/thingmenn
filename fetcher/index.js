import fetchVotes from './votes'
import { writeToFile } from '../utility/file'

fetchVotes()
  .then(data => {
    console.log('Successfully fetched votes')
    writeToFile(data, 'data/all-votes.json')
  }).catch(error => {
    console.log(`There was an error: ${error}`)
  })
