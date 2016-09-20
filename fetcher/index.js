import fetchData from './mps'
import { writeToFile } from '../utility/file'

fetchData()
  .then(data => {
    console.log('Successfully fetched votes')
    writeToFile(data, 'data/all-votes.json')
  }).catch(error => {
    console.log(`There was an error: ${error}`)
  })
