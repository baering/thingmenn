import cheerio from 'cheerio'
import { fetchHtml } from '../utility/html'

const mpListUrl = 'http://www.althingi.is/thingmenn/althingismenn/'

async function parseMpIds(html) {
  const htmlObj = cheerio.load(html)
  const mpRows = htmlObj('#t_thingmenn a')

  const ids = []
  for (let i = 0; i < mpRows.length; i++) {
    ids.push(mpRows[i].attribs.href.split('=')[1])
  }

  return ids
}

async function fetchMpIds() {
  const html = await fetchHtml(mpListUrl)
  return parseMpIds(html)
}

fetchMpIds().then(ids => console.log(ids))
