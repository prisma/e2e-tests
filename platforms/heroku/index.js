const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const { PrismaClient } = require('./prisma/prisma-client-js')
const client = new PrismaClient()

const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
  await client.user.deleteMany({})

  const createUser = await client.user.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })

  const updateUser = await client.user.update({
    where: {
      id: createUser.id,
    },
    data: {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
  })

  const users = await client.user.findOne({
    where: {
      id: createUser.id,
    },
  })

  const deleteManyUsers = await client.user.deleteMany()

  return res.send(
    JSON.stringify({
      createUser,
      updateUser,
      users,
      deleteManyUsers,
    }),
  )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
