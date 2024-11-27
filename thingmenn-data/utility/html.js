import { getFromCache, setToCache } from './cache'
import { getPage } from '../services/playwright'

export async function fetchHtml(url, shouldCache = true) {
  console.log(`fetchHtml: ${url}`, shouldCache)

  if (shouldCache) {
    const cached = getFromCache(url)

    if (cached) {
      console.log(`fetchHtml (cached):\t${url}`)
      return cached
    } else {
      console.log(`fetchHtml (cache miss):\t${url}`)
    }
  }

  try {
    const { page, context } = await getPage()

    await page.goto(url, { waitUntil: 'networkidle' })

    const randomBetween500And1000 = Math.floor(Math.random() * 500) + 500
    await page.waitForTimeout(500 + randomBetween500And1000)

    const pageHtml = await page.content()

    await page.close()
    await context.close()

    setToCache(url, pageHtml)
    return pageHtml
  } catch (e) {
    console.error(`Error fetching ${url}:`)
    console.log(e)
    return null
  }
}
