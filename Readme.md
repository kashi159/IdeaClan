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