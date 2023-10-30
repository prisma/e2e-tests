import fs from 'fs'
import fetch from 'node-fetch'
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

async function fetchWithPuppeteer(sandboxId: string) {
  const browser = await puppeteer.launch({
    headless: 'new',
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  await page.goto(`https://codesandbox.io/p/sandbox/${sandboxId}`)
  await sleep(20)
  const screenshot = await page.screenshot()
  fs.writeFileSync('image.png', screenshot as Buffer)
  await browser.close()

  const codesandboxUrl = `https://${sandboxId}.sse.codesandbox.io/`
  console.debug({ codesandboxUrl })
  const responseFromCodesandbox = await fetch(codesandboxUrl)
  const body = await responseFromCodesandbox.text()
  try {
    const bodyAsJSON = JSON.parse(body)
    console.debug(bodyAsJSON)
    return true
  } catch (e) {
    console.error('body as text:', body)
    throw new Error(e)
  }
}

async function sleep(seconds: number) {
  console.log(`Sleeping for ${seconds} sec`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(false)
    }, seconds * 1000)
  })
}

let attempts = 0
async function ensureSandbox(sandboxId: string) {
  attempts += 1
  console.log(`Attempt: ${attempts}`)
  if (attempts > 10) {
    return false
  }
  try {
    await fetchWithPuppeteer(sandboxId)
    return true
  } catch (e) {
    console.log(e)
    await sleep(5)
    console.log(`Retrying sandbox ${sandboxId}`)
    return ensureSandbox(sandboxId)
  }
}

async function main() {
  const relevantFilePaths = ['src/index.js', 'prisma/schema.prisma', 'prisma/.env', 'package.json', 'package-lock.json', 'sandbox.config.json']

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
      // Sets Client EngineType (binary/library) in Codesandbox
      if (file.filePath === 'prisma/.env') {
        file.content = file.content + `\PRISMA_CLIENT_ENGINE_TYPE=${process.env.PRISMA_CLIENT_ENGINE_TYPE}`
      }
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
  try {
    const r = await ensureSandbox(json.sandbox_id)
    if (!Boolean(r)) {
      // Log is fine, no need for an exit code as sh test.sh will fail anyways.
      console.log('Failed to ensure sandbox')
    }
  } catch (e) {
    console.error(`Something went wrong`)
    console.error(`You can debug this here: https://codesandbox.io/p/sandbox/${json.sandbox_id}`)
    throw new Error(e)
  }
}

main()
