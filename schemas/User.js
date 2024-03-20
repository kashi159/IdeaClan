// const { gql } = require('apollo-server-express');
import { gql } from 'apollo-server-lambda';

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
export default typeDefsUser