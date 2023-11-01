// Note: see wrangler.toml and https://www.npmjs.com/package/@cloudflare/workers-types for the version
/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from '../prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export interface Env {
  DATAPROXY_COMMON_URL: string
  DATAPROXY_FLAVOR: string
}

let prisma: PrismaClient

export default {
  fetch(request: Request, env: Env) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: env.DATAPROXY_COMMON_URL,
        },
      },
    })

    if (env.DATAPROXY_FLAVOR === 'DP2+Extension') {
      prisma = prisma.$extends(withAccelerate()) as any
    }

    return getUsers()
  },
}

async function getUsers() {
  console.debug(new Date(), 'Start await prisma.$transaction')
  console.time('transactionTook')
  const data = await prisma.$transaction([prisma.user.findFirst(), prisma.user.findMany()])
  console.timeEnd('transactionTook')
  console.debug(new Date(), 'End await prisma.$transaction')

  const json = JSON.stringify({ data })

  return new Response(json, {
    status: 200,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}
