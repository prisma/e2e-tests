import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema'

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
)

app.listen(4000, () => {
  console.log(
    `🚀 Server ready at: http://localhost:4000/graphql`,
  )
})
