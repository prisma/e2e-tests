import {
  PrismaClient as PCA,
  Prisma as PA,
} from '../../generated/database/client'
import {
  PrismaClient as PCB,
  Prisma as PB,
} from '../../generated/database/client2'

const prismaA = new PCA()
const prismaB = new PCB()
  
afterAll(async () => {
  await prismaA.$disconnect()
  await prismaB.$disconnect()
})

describe('Prisma in jest with multiple generators', () => {
  it('should work', () => {
    expect(1).toBe(1)
  })

  it('should return Prisma version', () => {
    const pjson = require('../../package.json')
    expect(PA.prismaVersion.client).toBe(pjson.dependencies['@prisma/client'])
    expect(PB.prismaVersion.client).toBe(pjson.dependencies['@prisma/client'])
  })

  it('should be able to query the database', async () => {
    const data = await prismaA.user.findMany()
    expect(data).toMatchObject([])
    const dataB = await prismaB.user.findMany()
    expect(dataB).toMatchObject([])
  })

  it('should use the correct engine files', async () => {
    const fs = require('fs')
    const path = require('path')
    const filesA = fs.readdirSync(
      path.dirname(require.resolve('../../generated/database/client')),
    )
    const filesB = fs.readdirSync(
      path.dirname(require.resolve('../../generated/database/client2')),
    )
    if (process.env.PRISMA_FORCE_NAPI === 'true') {
      expect(filesA).toMatchInlineSnapshot(`
Array [
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "libquery_engine-debian-openssl-1.1.x.so.node",
  "runtime",
  "schema.prisma",
]
`)
      expect(filesB).toMatchInlineSnapshot(`
Array [
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "libquery_engine-debian-openssl-1.1.x.so.node",
  "runtime",
  "schema.prisma",
]
`) 
    } else {
      expect(filesA).toMatchInlineSnapshot(`
Array [
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "query-engine-debian-openssl-1.1.x",
  "runtime",
  "schema.prisma",
]
`)
      expect(filesB).toMatchInlineSnapshot(`
Array [
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "query-engine-debian-openssl-1.1.x",
  "runtime",
  "schema.prisma",
]
`)  
    }
  })
})
