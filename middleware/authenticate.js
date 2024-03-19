import dotenv from 'dotenv';
dotenv.config();

import User from "../models/User.js";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY_USER;

const authenticate = async (req, res, next) => {
    try {
      const token =  req.headers['authorization'];
      // console.log(token);
        if (!token) {
          throw new Error('Unauthorized: No token provided.')
        }

        const decoded = jwt.verify(token, secret);
        // console.log(decoded)
        const userId = decoded.email;
        const user = await User.findOne({ where: { email: userId } });
        
        if (!user) {
            return res.status(404).json({ msg: 'Unauthorized: User not found.' });
        }
        return user
        req.user = user;
        // next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        // req.user = null;
        // next();
    }
};

export default authenticate;
