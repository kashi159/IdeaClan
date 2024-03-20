const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const Book = require('../models/Book.js');
// const User = require('../models/User.js');
const { Op } = require('sequelize');
require('dotenv').config();
const User = require('../models/User.js'); // Assuming User model is exported using CommonJS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const typeDefsBook = require('../schemas/Book');
// const typeDefsUser = require('../schemas/User');
// const booksResolvers = require('../resolvers/books');
// const usersResolvers = require('../resolvers/users');
// const authenticate = require('../middleware/authenticate');
const sequelize = require('../utils/database');
const secret = process.env.JWT_SECRET_KEY_USER;

const authenticate = async (req, res, next) => {
    try {
      const token =  req.headers['authorization'];
      // console.log(token);
        if (!token) {
          throw new Error('Unauthorized: No token provided.')
        }

        const decoded = jwt.verify(token, secret);
        // console.log(decoded)
        const userId = decoded.email;
        const user = await User.findOne({ where: { email: userId } });
        
        if (!user) {
            return res.status(404).json({ msg: 'Unauthorized: User not found.' });
        }
        return user
        req.user = user;
        // next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        // req.user = null;
        // next();
    }
};

const typeDefsBook = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    owner: ID!
    borrowRequestedBy: ID
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(keyword: String!): [Book!]!
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
    borrowBook(bookId: ID!): Book!
    buyBook(bookId: ID!): Book!
    requestBorrow(bookId: ID!, ownerId: ID!): Book!
    approveBorrowRequest(bookId: ID!, userId: ID!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;

const typeDefsUser = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(input: UserInput!): User!
    login(input: LoginInput!): AuthPayload!
    deleteUser(id: ID!): Boolean!
  }
`;

const booksResolvers = {
  Mutation: {
    addBook: async (_, { title, author }, user) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const newBook = await Book.create({ title, author, owner: 0 });
      return newBook;
    },
    borrowBook: async (_, { bookId }, user) => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner) {
        throw new Error('Book already owned');
      }
      book.owner = user.id;
      return await book.save();
    },
    buyBook: async (_, { bookId }, user) => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner) {
        throw new Error('Book already owned');
      }
      book.owner = user.id;
      return await book.save();
    },
    requestBorrow: async (_, { bookId, ownerId }, user) => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner != ownerId) {
        console.log(book.owner, ownerId);
        throw new Error('Book not owned by specified user');
      }
      book.borrowRequestedBy = user.id;
      return await book.save();
    },
    approveBorrowRequest: async (_, { bookId, userId }, user) => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      console.log(book.owner, user.id);
      if (book.owner != user.id) {
        throw new Error('Not the owner of this book');
      }
      if (!book.borrowRequestedBy || book.borrowRequestedBy != userId) {
        throw new Error('No borrow request found for this user and book');
      }
      book.owner = userId;
      book.borrowRequestedBy = null;
      return await book.save();
    },
    deleteBook: async (_, { id }, user) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(id);
      if (!book) {
        throw new Error('Book not found');
      }
      const deleted = await book.destroy(); 
      return !!deleted;
    }
  },
  Query: {
    book: async (_, { id }) => {
      return await Book.findByPk(id);
    },
    books: async () => {
      return await Book.findAll();
    },
    searchBooks: async (_, { keyword }) => {
      const regex = `%${keyword}%`;
      return await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: regex } },
            { author: { [Op.like]: regex } },
          ],
        },
      });
    },
  },
};

const usersResolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
    user: async (_, { id }) => {
      return await User.findByPk(id);
    },
    me: (_, __, user) => { // Change the argument from args to context, and destructure user from it
      // console.log(args);
      if (!user) {
        throw new Error('Unauthorized');
      }
      return user;
    },
  },
  Mutation: {
    register: async (_, args ) => {
      const { username, email, password, role } = args.input;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword, role: role});
      return newUser;
    },
    login: async (_, args ) => {
      const { email, password } = args.input;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY_USER, { expiresIn: '1d' });
      return { token };
    },
    deleteUser: async (_, { id }, user) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      
      const deletedUser = await User.destroy({ where: { id } });
      return deletedUser ? true : false;
    },
  },
};
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