import axios from 'axios'

export function fetchHtml(url) {
  console.log(`fetchHtml: ${url}`)
  return new Promise((resolve) => {
    axios.get(url).then(response => resolve(response.data))
  })
}
