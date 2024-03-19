// resolvers/users.js
const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
    user: async (_, { id }) => {
      return await User.findByPk(id);
    },
    me: (_, __, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      return req.user;
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });
      return newUser;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY_USER, { expiresIn: '1d' });
      return { token };
    },
    deleteUser: async (_, { id }, { req }) => {
      if (!req.user) {
        throw new Error('Unauthorized');
      }
      if (id !== req.user.id) {
        throw new Error('Unauthorized');
      }
      const deletedUser = await User.destroy({ where: { id } });
      return deletedUser ? true : false;
    },
  },
};
