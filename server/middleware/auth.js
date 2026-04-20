import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';

const verifyToken = promisify(jwt.verify);

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};

// Middleware to check if user is a job seeker
export const authorizeJobSeeker = (req, res, next) => {
  if (req.user.role !== 'jobseeker') {
    return res.status(403).json({ message: 'Access denied. Job seekers only.' });
  }
  next();
};

// Middleware to check if user is a company/HR
export const authorizeCompany = (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Access denied. Companies only.' });
  }
  next();
};

// Middleware to check if user is admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// Middleware to check if user is company or admin
export const authorizeCompanyOrAdmin = (req, res, next) => {
  if (req.user.role !== 'company' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  next();
};