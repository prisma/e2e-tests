import fetch from 'node-fetch'
import fs from 'fs'
import puppeteer from 'puppeteer'

interface CSBFile {
  content: object | string
  isBinary?: Boolean
}

interface CSBFiles {
  [index: string]: CSBFile
}

function getBinaries() {
  return []
}

function getEncoding(file: string) {
  const binaries = getBinaries()
  return binaries.includes(file) ? 'binary' : 'utf-8'
}

function isBinary(file: string) {
  const binaries = getBinaries()
  return binaries.includes(file)
}

async function fetchWithPuppeteer(endpoint) {
  const options = {
    ...(process.env.CI === '1' && {
      executablePath: 'google-chrome-unstable',
    }),
  }
  console.log(options)
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  await page.goto(endpoint)
  await page.waitForTimeout(10000)
  const screenshot = await page.screenshot()
  fs.writeFileSync('image.png', screenshot)
  await browser.close()

  const r = await fetch(endpoint)
  try {
    await r.json()
    return true
  } catch (e) {
    throw new Error(e)
  }
}

async function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(false)
    }, seconds * 1000)
  })
}

let attempts = 0
async function ensureSandbox(endpoint) {
  attempts += 1
  console.log(`Attempt: ${attempts}`)
  if (attempts > 60) {
    return false
  }
  try {
    await fetchWithPuppeteer(endpoint)
    return true
  } catch (e) {
    console.log(e)
    const sleepTime = 5
    console.log(`Sleeping for ${sleepTime} sec`)
    await sleep(sleepTime)
    console.log(`Retrying`)
    return ensureSandbox(endpoint)
  }
}

async function main() {
  const relevantFilePaths = [
    'src/index.js',
    'prisma/schema.prisma',
    'prisma/.env',
    'package.json',
    'yarn.lock',
  ]

  const files: CSBFiles = relevantFilePaths
    .map((filePath) => {
      return {
        filePath,
        content: fs.readFileSync(filePath, {
          encoding: getEncoding(filePath),
        }),
        isBinary: isBinary(filePath),
      }
    })
    .reduce((files, file) => {
      return {
        ...files,
        [`${file.filePath}`]: {
          content: file.content,
          isBinary: file.isBinary,
        },
      }
    }, {})

  let r = fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files,
    }),
  })
  const data = await r
  const json = await data.json()
  fs.writeFileSync('sandbox_id', json.sandbox_id)
  const endpoint = `https://${json.sandbox_id}.sse.codesandbox.io/`
  try {
    const r = await ensureSandbox(endpoint)
    if (!Boolean(r)) {
      // Log is fine, no need for an exit code as sh test.sh will fail anyways.
      console.log('Failed to ensure sandbox')
    }
  } catch (e) {
    throw new Error(e)
  }
}

main()
