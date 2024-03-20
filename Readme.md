Getting started
Welcome to the ideaclan-test API! 🎉 Get familiar with available objects in the Schema Reference, or try querying this graph using Explorer.

Project Documentation:

1. Setup Instructions:

Setup Instructions:

Install dependencies: npm install
Configure environment variables: Create a .env file and set PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST_NAME, DB_PORT, and other necessary variables.
Run the server: npm start


API Documentation:

Accessing the graph
🛰 You can send operations to this graph at http://localhost:{PORT}


Running operations

query Books {
    books {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    book(id: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    searchBooks(keyword: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    user(id: null) {
        id
        username
        email
        role
    }
    me {
        id
        username
        email
        role
    }
    users {
        id
        username
        email
        role
    }
}

mutation AddBook {
    addBook(title: null, author: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    borrowBook(bookId: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    buyBook(bookId: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    requestBorrow(bookId: null, ownerId: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    approveBorrowRequest(bookId: null, userId: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
    deleteBook(id: null)
    register(input: null) {
        id
        username
        email
        role
    }
    login(input: null) {
        token
    }
    deleteUser(id: null)
}



query Books2 {
    books {
        id
        title
        author
        owner
        borrowRequestedBy
    }
}

mutation AddBook2 {
    addBook(title: null, author: null) {
        id
        title
        author
        owner
        borrowRequestedBy
    }
}


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
