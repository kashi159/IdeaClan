Getting started
Welcome to the ideaclan-test API! 🎉 Get familiar with available objects in the Schema Reference, or try querying this graph using Explorer.


What this graph is all about
Describe the purpose and use cases for your graph here. This is where you can tell the story of your API, and all of its deep magic...🦄🌌✨

Accessing the graph
🛰 You can send operations to this graph at http://localhost:3000/graphql

📇 The Apollo Registry holds the canonical location of your schema. In the registry, this graph is referred to by its “graph ref”, which is: ideaclan-test@current.

(Note: you can download Rover, the Apollo CLI tool for working with your schema locally.)

Running operations

query Query {
    id
}

Project Documentation:

1. Setup Instructions:

Setup Instructions:

Install dependencies: npm install
Configure environment variables: Create a .env file and set PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST_NAME, DB_PORT, and other necessary variables.
Run the server: npm start
API Documentation:

visit http:localhost:{port}/graphql to view the GraphQL playground.
Queries:

books: Retrieves a list of all books.
book(id: ID!): Retrieves a specific book by its ID.
searchBooks(keyword: String!): Searches for books by title or author using a keyword.
Mutations:

addBook(title: String!, author: String!): Book!: Adds a new book to the database.
borrowBook(bookId: ID!): Book!: Borrows a book.
buyBook(bookId: ID!): Book!: Buys a book.
requestBorrow(bookId: ID!, ownerId: ID!): Book!: Requests to borrow a book.
approveBorrowRequest(bookId: ID!, userId: ID!): Book!: Approves a borrow request.
Authentication Procedures:

This API requires authentication using JWT tokens.
To authenticate, send a POST request to the /login endpoint with valid credentials (email and password).
Include the JWT token in the Authorization header for subsequent requests.
Additional Considerations:
Ensure that the API documentation is clear, concise, and easy to understand.
Include examples and code snippets wherever necessary to illustrate API usage.
Update the documentation as the API evolves to reflect any changes or additions to endpoints, schemas, or authentication procedures.