const { Prisma, PrismaClient } = require('@prisma/client')
const { createClient } = require('@libsql/client')
const { PrismaLibSQL }  = require('@prisma/adapter-libsql')

const connectionString = process.env.DRIVER_ADAPTERS_TURSO_VERCEL_NEXTJS_DATABASE_URL

const client = createClient({ url: connectionString })
const adapter = new PrismaLibSQL(client)
const prisma = new PrismaClient({ adapter })

module.exports = async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  
  const getResult = async (prisma) => {
    const result = {
      prismaVersion: Prisma.prismaVersion.client,
      deleteMany: await prisma.user.deleteMany().then(() => ({ count: 0 })),
      create: await prisma.user.create({
        data: {
          email: `test-1@prisma.io`,
          age: 27,
          name: 'Test 1',
        },
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      createMany: await prisma.user.createMany({
        data: [
          {
            email: `test-2@prisma.io`,
            age: 29,
            name: 'Test 2',
          },
          {
            email: `test-3@prisma.io`,
            age: 29,
            name: 'Test 3',
          },
        ],
      }),
      findMany: await prisma.user.findMany({
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      findUnique: await prisma.user.findUnique({
        where: {
          email: "test-1@prisma.io"
        },
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      update: await prisma.user.update({
        where: {
          email: "test-1@prisma.io"
        },
        data: {
          age: 26
        },
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      updateMany: await prisma.user.updateMany({
        where: {
          age: 26
        },
        data: {
          age: 27
        },
      }),
      findFirst: await prisma.user.findFirst({
        where: {
          age: 27
        },
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      delete: await prisma.user.delete({
        where: {
          email: "test-1@prisma.io"
        },
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
      count: await prisma.user.count(),
      aggregate: await prisma.user.aggregate({
        _avg: {
          age: true
        },
      }).then(({ _avg }) => ({ age: Math.trunc(_avg?.age ?? 0) })),
      groupBy: await prisma.user.groupBy({
        by: ['age'],
        _count: {
          age: true
        },
      }),
      findFirstOrThrow: await prisma.user.findFirstOrThrow({
        select: {
          age: true,
          email: true,
          name: true,
        }
      }),
      findUniqueOrThrow: await prisma.user.findUniqueOrThrow({
        where: {
          email: "test-2@prisma.io"
        },
        select: {
          age: true,
          email: true,
          name: true,
        }
      }),
      upsert: await prisma.user.upsert({
        where: {
          email: "test-4@prisma.io"
        },
        create: {
          email: "test-4@prisma.io",
          age: 30,
          name: 'Test 4',
        },
        update: {},
        select: {
          email: true,
          age: true,
          name: true,
        }
      }),
    }

    // sort results by email to make the order deterministic
    result.findMany = result.findMany.sort((a, b) => a.email > b.email ? 1 : -1)

    return result
  }

  const regResult = await getResult(prisma)
  const itxResult = await prisma.$transaction(getResult)
  const result = { itxResult, regResult }

  res.status(200).json(result)
}
