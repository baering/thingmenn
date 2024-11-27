import { chromium } from 'playwright'

export async function startBrowser() {
  const browser = await chromium.launch()

  return browser
}

export async function getBrowser() {
  return await startBrowser()
}

export async function getPage() {
  const browser = await getBrowser()

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })

  const page = await context.newPage()
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'cookieEnabled', {
      get: () => true,
    })
  })

  return { context, page }
}
