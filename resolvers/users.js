require('dotenv').config();
const User = require('../models/User.js'); // Assuming User model is exported using CommonJS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

module.exports = usersResolvers;
