import jwt from 'jsonwebtoken';
import config from '../config.js';

const JWT_SECRET = config.security.JWT_SECRET;

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Authentication token is missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Authentication token is invalid or expired' });
    req.user = decoded;
    next();
  });
};