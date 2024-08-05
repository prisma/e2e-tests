const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient()

describe('Prisma', () => {
  afterAll(() => {
    prisma.$disconnect()
  })

  it('should return Prisma version', () => {
    const pjson = require('./package.json')
    expect(Prisma.prismaVersion.client).toBe(pjson.dependencies['@prisma/client'])
  })

  it('should be able to query the database', async () => {
    const data = await prisma.user.findMany()
    expect(data).toMatchObject([])
  })

  it('should use the correct engine files', async () => {
    const fs = require('fs')
    const path = require('path')
    const generatedClientDir = path.dirname(
      require.resolve('.prisma/client', {
        paths: [path.dirname(require.resolve('@prisma/client'))],
      }),
    )
    const files = fs.readdirSync(generatedClientDir)
    if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== 'binary') {
      expect(files).toMatchInlineSnapshot(`
[
  "default.d.ts",
  "default.js",
  "deno",
  "edge.d.ts",
  "edge.js",
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "libquery_engine-linux-arm64-openssl-3.0.x.so.node",
  "package.json",
  "schema.prisma",
  "wasm.d.ts",
  "wasm.js",
]
`)
    } else {
      expect(files).toMatchInlineSnapshot(`
[
  "default.d.ts",
  "default.js",
  "deno",
  "edge.d.ts",
  "edge.js",
  "index-browser.js",
  "index.d.ts",
  "index.js",
  "package.json",
  "query-engine-linux-arm64-openssl-3.0.x",
  "schema.prisma",
  "wasm.d.ts",
  "wasm.js",
]
`)
    }
  })
})
