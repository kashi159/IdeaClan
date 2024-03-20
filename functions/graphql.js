import { ApolloServer } from 'apollo-server-lambda'
import ServerlessHttp from 'serverless-http'
import { typeDefs as typeDefsBook } from '../schemas/Book.js'
import { typeDefs as typeDefsUser } from '../schemas/User.js'
import booksResolvers from '../resolvers/books.js'
import usersResolvers from '../resolvers/users.js'
import authenticate from '../middleware/authenticate.js'
import sequelize from '../utils/database.js'

const server = new ApolloServer({
  typeDefs: [typeDefsBook, typeDefsUser],
  resolvers: [booksResolvers, usersResolvers],
  context: async ({ event, context }) => {
    const user = await authenticate(event)
    return user 
  }
})

// Wrap the ApolloServer instance with serverless http handler
const graphqlHandler = ServerlessHttp(server)

// Export the handler for Netlify
export const handler = async (event, context) => {
  // Set the path to handle the GraphQL endpoint
  event.path = '/.netlify/functions/graphql'
  // Call the serverless handler
  return graphqlHandler(event, context)
}

sequelize.sync({ force: process.env.FORCE_DB_SYNC === 'true' })
  .then(() => {
    console.log('Database synchronization successful')
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error)
  })
