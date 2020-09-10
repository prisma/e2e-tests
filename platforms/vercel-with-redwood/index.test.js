const { request, gql } = require('graphql-request')
const pjson = require('./api/package.json')

// const endpoint = 'https://e2e-vercel-with-redwood.vercel.app/api/graphql'
const endpoint = 'http://localhost:8911/graphql'

test('should test prisma version', async () => {
  const query = gql`
    query {
      prismaVersion
    }
  `
  const data = await request(endpoint, query)
  expect(data.prismaVersion).toEqual(pjson.dependencies['@prisma/client'])
})

test('should query graphql users', async () => {
  const query = gql`
    query {
      users {
        id
        email
        name
      }
    }
  `
  const data = await request(endpoint, query)
  expect(data).toMatchSnapshot()
})
