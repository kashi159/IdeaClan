const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefsBook = require('./schemas/Book');
const typeDefsUser = require('./schemas/User');
const booksResolvers = require('./resolvers/books');
const usersResolvers = require('./resolvers/users');
const { authenticate } = require('./middleware/authenticate');
require('dotenv').config();

const { sequelize } = require('./utils/database');

const app = express();


const server = new ApolloServer({
  typeDefsBook,
  typeDefsUser,
  booksResolvers,
  usersResolvers,
  context: ({ req }) => ({ req }) // Pass request object to context for authentication
});

server.applyMiddleware({ app });

// Middleware for authentication
app.use(authenticate);

sequelize
  .sync({ force: process.env.FORCE_DB_SYNC === "true" }) // Set FORCE_DB_SYNC in your .env for force sync
  .then(() => {
    console.log("Database synchronization successful");
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is running");
    });
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });
