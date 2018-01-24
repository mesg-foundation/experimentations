import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

const server = new GraphQLServer({
  typeDefs: "./src/typedefs.graphql",
  resolvers
})
server.start(({ port }) => console.log(`Server running on localhost:${port}`))
