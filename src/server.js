const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const typeDefsBook = require('../schemas/Book.js');
const typeDefsUser = require('../schemas/User.js');
const booksResolvers = require('../resolvers/books.js');
const usersResolvers = require('../resolvers/users.js');
const authenticate = require('../middleware/authenticate.js');
const sequelize = require('../utils/database.js');

function createLambdaServer() {
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

function createLocalServer() {
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
    });

module.exports = { createLambdaServer, createLocalServer };