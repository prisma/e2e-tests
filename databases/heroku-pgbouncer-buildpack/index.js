const express = require('express')

const { PrismaClient, Prisma } = require('@prisma/client')

const clientWithQueryStringParam = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_PGBOUNCER + '?pgbouncer=true',
    },
  },
})

const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
  const createUser = await clientWithQueryStringParam.user.create({
    data: {
      id,
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })
  const updateUser = await clientWithQueryStringParam.user.update({
    where: {
      id: createUser.id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })
  const users = await clientWithQueryStringParam.user.findUnique({
    where: {
      id: createUser.id,
    },
  })
  const deleteUser = await clientWithQueryStringParam.user.delete({
    where: { id: 1 },
  })

  return res.send(
    JSON.stringify({
      version: Prisma.prismaVersion.client,
      createUser,
      updateUser,
      users,
      deleteUser,
    }),
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
