const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');


const typeDefsBook = require('../schemas/Book');
const typeDefsUser = require('../schemas/User');
const booksResolvers = require('../resolvers/books');
const usersResolvers = require('../resolvers/users');
const authenticate = require('../middleware/authenticate');

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