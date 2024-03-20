import { ApolloServer } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';
import { gql } from 'apollo-server-lambda';

import { typeDefs as typeDefsBook } from '../schemas/Book.js'
import { typeDefs as typeDefsUser } from '../schemas/User.js'
import booksResolvers from '../resolvers/books.js'
import usersResolvers from '../resolvers/users.js'
import authenticate from '../middleware/authenticate.js'
import sequelize from '../utils/database.js'

function createLambdaServer () {
    return new ApolloServerLambda({
        typeDefs: [typeDefsBook, typeDefsUser],
        resolvers: [booksResolvers, usersResolvers],
        mocks: true,
        playground: true,
        context: async ({ event, context }) => {
          const user = await authenticate(event)
          return user 
        }
    });
  }

  function createLocalServer () {
    return new ApolloServer({
        typeDefs: [typeDefsBook, typeDefsUser],
        resolvers: [booksResolvers, usersResolvers],
        mocks: true,
        playground: true,
        context: async ({ event, context }) => {
          const user = await authenticate(event)
          return user 
        }
    });
  }

sequelize.sync({ force: process.env.FORCE_DB_SYNC === 'true' })
.then(() => {
  console.log('Database synchronization successful')
})
.catch((error) => {
  console.error('Error synchronizing database:', error)
})

  module.exports = { createLambdaServer, createLocalServer }