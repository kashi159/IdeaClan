// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const secret = process.env.JWT_SECRET_KEY_USER

const authenticate = async(req, res, next) =>{
        try{
            const token = req.header('Authorization');
            if(!token) {
                return res.status(401).json({msg: 'UnAuthorized: No token provided.'});
              }
    
            const users = jwt.verify(token , secret);
            const UserId = users.userId;
            // console.log('userid>>>',UserId)
            const user = await User.findOne({where :{email : UserId}})
            if(!user) {
                return res.status(404).json({msg: 'UnAuthorized: User not found'}); 
              }
                req.user = user;
                next()
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { authenticate };
