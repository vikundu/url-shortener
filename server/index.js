const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
  }

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: request => {
        return {
          ...request,
          prisma,
        }
    },
    debug:true
})

server.start(() => console.log('Server is running on port 4000'))