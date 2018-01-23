import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

const server = new GraphQLServer({
  typeDefs: "./src/typedefs.graphql",
  resolvers,
  context: {
    foo: 'bar'
  }
})
server.start({
  playground: "/playground",
}, ({ port }) => console.log(`Server running on localhost:${port}`))
