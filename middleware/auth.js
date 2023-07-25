const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '';
    if (JWT_TOKEN_SECRET === '') {
        console.error('JWT_TOKEN_SECRET not defined');
        throw new Error('JWT_TOKEN_SECRET not defined');
    }

    if(jwt.verify(token, JWT_TOKEN_SECRET)){
      next();
    } else {
      throw new Error('Invalid request!');
    }
  } catch {
    return res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};