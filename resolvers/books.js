// resolvers/books.js
const { Book } = require('../models/Book')

module.exports = {
  Mutation: {
    addBook: async (_, { title, author }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const newBook = await Book.create({ title, author, owner: null });
      return newBook;
    },
    borrowBook: async (_, { bookId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findByPk(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner) {
        throw new Error('Book already owned');
      }
      book.owner = req.user.id;
      return await book.save();
    },
    buyBook: async (_, { bookId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner) {
        throw new Error('Book already owned');
      }
      book.owner = req.user.id;
      return await book.save();
    },
    requestBorrow: async (_, { bookId, ownerId }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (book.owner !== ownerId) {
        throw new Error('Book not owned by specified user');
      }
      book.borrowRequestedBy = req.user.id;
      return await book.save();
    },
    approveBorrowRequest: async (_, { bookId, userId }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      if (!book.borrowRequestedBy || book.borrowRequestedBy !== userId) {
        throw new Error('No borrow request found for this user and book');
      }
      book.owner = userId;
      book.borrowRequestedBy = null;
      return await book.save();
    },
  },
  Query: {
    books: async () => {
      return await Book.find();
    },
    searchBooks: async (_, { keyword }) => {
      const regex = new RegExp(keyword, 'i'); // Case-insensitive search
      return await Book.find({ $or: [{ title: regex }, { author: regex }] });
    },
  },
};
