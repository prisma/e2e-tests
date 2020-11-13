import arg from 'arg'
import originalFetch from 'node-fetch'

function getExpectedData(prismaVersion: string) {
  return `{"version":"${Prisma}","createUser":{"id":"12345","email":"alice@prisma.io","name":"Alice"},"updateUser":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"users":{"id":"12345","email":"bob@prisma.io","name":"Bob"},"deleteManyUsers":{"count":1}}`
}

let rdata = null

function getFetch(expectedData: string) {
  const RETRIES = 15
  const RETRIES_DELAY = 5
  const fetch = require('fetch-retry')(originalFetch, {
    retryDelay: RETRIES_DELAY * 1000,
    retryOn: (attempt, error, response) => {
      if (attempt >= RETRIES) {
        return false
      }

      const r = response.clone()
      // Because https://github.com/jonbern/fetch-retry/issues/29
      // It is okay for us to pass the test in the next run
      r.text().then((data) => {
        rdata = data
      })

      if (
        error !== null ||
        r.status != 200 ||
        JSON.stringify(rdata) !== JSON.stringify(expectedData)
      ) {
        console.log(`retrying, attempt number ${attempt + 1}`)
        return true
      } else {
        return false
      }
    },
  })
  return fetch
}

interface FetchRetryArgs {
  url: string
  prismaVersion: string
}

async function fetchRetry(args: FetchRetryArgs) {
  const expectedData = getExpectedData(args.prismaVersion)
  const r = await getFetch(expectedData)(args.url)
  const data = await r.text()

  if (JSON.stringify(data) !== JSON.stringify(expectedData)) {
    console.log(
      `expected '${JSON.stringify(expectedData)}', got '${JSON.stringify(
        data,
      )}'`,
    )
    process.exit(1)
  } else {
    console.log('Success')
    process.exit(0)
  }
}

if (require.main === module) {
  const args = arg({
    '--url': String,
    '--prisma-version': String,
  })

  const url = args['--url']
  constPrisma = args['--prisma-version']
  console.log({
    url,
    prismaVersion,
  })
  fetchRetry({
    url,
    prismaVersion,
  })
}
