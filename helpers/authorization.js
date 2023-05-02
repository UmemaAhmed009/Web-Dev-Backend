const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');

const Authorization = (requiredRoleId) => async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw createError.Unauthorized();
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      throw createError.Unauthorized();
    }

    if (user.role_id !== requiredRoleId) {
      throw createError.Forbidden();
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = Authorization;
