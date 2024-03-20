const Book = require('../models/Book.js');
const { Op } = require('sequelize');

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

emodule.exports = booksResolvers;