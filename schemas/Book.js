const { gql } = require('apollo-server-express');

module.exports = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    owner: ID!
  }

  extend type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  extend type Mutation {
    addBook(title: String!, author: String!): Book!
    deleteBook(id: ID!): Boolean!
  }
`;