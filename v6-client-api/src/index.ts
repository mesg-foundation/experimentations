import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
import { Context } from './utils'

const resolvers = {
  Query: {
    workflow: (parent, { id }, context: Context, info) => context.db.query
      .workflows({ where: { id } }, info),
    allWorkflows: (parent, args, context: Context, info) => context.db.query
      .workflows({}, info)
  },
  Mutation: {
    createWorkflow: (parent, { data }, context: Context, info) => context.db.mutation
      .createWorkflow({ data }, info)
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466/v6-client-api/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queries & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
