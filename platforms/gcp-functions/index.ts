import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export async function handler(req: any, res: any) {
  await client.user.deleteMany({})

  const id = '12345'

  const createUser = await client.user.create({
    data: {
      id,
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

  const deleteManyUsers = await client.user.deleteMany({})

  res.status(200).send({
    createUser,
    updateUser,
    users,
    deleteManyUsers,
  });
}
