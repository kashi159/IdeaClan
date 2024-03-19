// const { gql } = require('apollo-server-express');

const typeDefsBook = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    owner: ID!
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
export default typeDefsBook;
